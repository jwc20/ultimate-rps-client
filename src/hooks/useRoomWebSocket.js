import {useEffect, useRef, useState} from "react";
import {tokenManager} from "../api/tokenManager";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

const actionNames = {
    0: '🪨',
    1: '📄',
    2: '✂️'
};

export function useRoomWebSocket(roomId, user, setMessages) {
    const wsRef = useRef(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [gameState, setGameState] = useState({
        players: [],
        kickedPlayers: [],
        readyPlayers: 0,
        totalActive: 0,
        isEliminated: false,
        currentRound: 1,
        hasPlayed: false,
        gameOver: false,
        winner: null,
    });
    const handleDisconnect = () => {
        wsRef.current.close();
        wsRef.current = null;
    }

    useEffect(() => {
        if (!roomId) return;
        let isCleaningUp = false;
        const token = tokenManager.getToken();
        const ws = new WebSocket(
            `${WEBSOCKET_URL}/ws/${roomId}?token=${token}`
        );
        wsRef.current = ws;
        // ws.onopen = () => {
        //     // if (!isCleaningUp) {
        //     //     // console.log(`Connected to room ${roomId}`);
        //     //     // setConnectionStatus('connected');
        //     // }
        // };

        ws.onmessage = (event) => {
            if (isCleaningUp) return;

            let parsed;
            try {
                parsed = JSON.parse(event.data);
            } catch {
                parsed = {type: 'message', message: event.data};
            }

            switch (parsed.type) {
                case "history":
                    setMessages((prev) => [...prev, {
                        username: parsed.username,
                        message: parsed.message,
                        timestamp: parsed.timestamp,
                        type: "message"
                    }]);
                    break;

                case "message":
                    setMessages((prev) => [...prev, {
                        username: parsed.username,
                        message: parsed.message,
                        timestamp: parsed.timestamp || new Date().toISOString(),
                        type: "message"
                    }]);
                    break;

                case "play":
                    setMessages((prev) => [...prev, {
                        username: parsed.username,
                        message: parsed.message,
                        timestamp: parsed.timestamp || new Date().toISOString(),
                        type: "play"
                    }]);
                    break;

                case "player_joined":
                    setGameState((prev) => ({
                        ...prev,
                        players: parsed.players || [],
                        totalActive: (parsed.players || []).length,
                    }));
                    setMessages((prev) => [...prev, {
                        type: "system",
                        message: `${parsed.username} joined the room`,
                        timestamp: new Date().toISOString(),
                    }]);
                    break;

                case "player_left":
                    setGameState((prev) => ({
                        ...prev,
                        players: parsed.players || [],
                        totalActive: (parsed.players || []).length,
                    }));
                    setMessages((prev) => [...prev, {
                        type: "system",
                        message: `${parsed.username} left the room`,
                        timestamp: new Date().toISOString(),
                    }]);
                    break;

                case "player_ready":
                    setGameState((prev) => ({
                        ...prev,
                        readyPlayers: parsed.ready_count,
                        totalActive: parsed.total_active,
                    }));
                    setMessages((prev) => [...prev, {
                        type: "system",
                        message: `${parsed.username} is ready`,
                        timestamp: new Date().toISOString(),
                    }]);
                    break;

                case "game_started":
                    setGameState((prev) => ({
                        ...prev,
                        gameActive: true,
                        players: parsed.players || [],
                        hasPlayed: false,
                    }));
                    setMessages((prev) => [...prev, {
                        type: "system",
                        message: "Game started! Make your move.",
                        timestamp: new Date().toISOString(),
                    }]);
                    break;

                case "kick_player": {
                    // console.log(parsed);
                    setGameState((prev) => ({
                        ...prev,
                        players: parsed.players || [],
                        totalActive: (parsed.players || []).length,
                        kickedPlayers: parsed.kicked_players || [],
                    }));
                    setMessages((prev) => [...prev, {
                        type: "system",
                        message: `${parsed.host} kicked ${parsed.kick_player} from the room`,
                        timestamp: new Date().toISOString(),
                    }]);
                    break;
                }

                case "round_complete": {
                    let roundSummary = `Round ${parsed.round} complete!\n`;

                    // Add player actions from server
                    if (parsed.actions && Object.keys(parsed.actions).length > 0) {
                        roundSummary += "\nPlayer Actions:";
                        for (const [player, action] of Object.entries(parsed.actions)) {
                            const actionName = actionNames[action] || `action ${action}`;
                            roundSummary += `\n• ${player}: ${actionName}`;
                        }
                    }

                    // Add elimination info
                    const eliminatedMsg = parsed.eliminated.length > 0
                        ? `\n\nEliminated: ${parsed.eliminated.join(", ")}`
                        : "\n\nNo one eliminated";

                    roundSummary += eliminatedMsg;

                    setGameState((prev) => ({
                        ...prev,
                        isEliminated: parsed.eliminated.includes(user?.username),
                        currentRound: parsed.round + 1,
                        hasPlayed: false,
                        readyPlayers: 0,
                        gameOver: parsed.game_over,
                        winner: parsed.winner,
                    }));

                    setMessages((prev) => [...prev, {
                        type: "system",
                        message: roundSummary,
                        timestamp: new Date().toISOString(),
                    }]);

                    if (parsed.game_over) {
                        setMessages((prev) => [...prev, {
                            type: "system",
                            message: `Game Over! Winner: ${parsed.winner || "No winner"}`,
                            timestamp: new Date().toISOString(),
                        }]);
                    }
                    break;
                }


                case "game_reset":
                    setGameState({
                        players: parsed.players || [],
                        readyPlayers: 0,
                        totalActive: (parsed.players || []).length,
                        isEliminated: false,
                        currentRound: 1,
                        hasPlayed: false,
                        gameOver: false,
                        gameActive: false,
                        winner: null,
                    });
                    setMessages((prev) => [...prev, {
                        type: "system",
                        message: "Game has been reset",
                        timestamp: new Date().toISOString(),
                    }]);
                    break;

                case "error":
                    setMessages((prev) => [...prev, {
                        type: "error",
                        message: parsed.message,
                        timestamp: new Date().toISOString(),
                    }]);
                    break;

                default:
                    console.log("Unknown message type:", parsed.type);
            }
        };

        ws.onclose = (event) => {
            if (!isCleaningUp) {
                console.log(`Disconnected from room ${roomId}`);
                if (event.code === 4001) {
                    setShouldRedirect(true);
                }

                handleDisconnect();
                // setConnectionStatus('disconnected');
            }
        };

        ws.onerror = (err) => {
            if (!isCleaningUp && ws.readyState !== WebSocket.CLOSING) {
                console.error("WebSocket error:", err);
                // setConnectionStatus('error');
            }
        };

        return () => {
            isCleaningUp = true;
            ws.close();
        };
    }, [roomId, user?.username, setMessages]);

    return {wsRef, gameState, setGameState, shouldRedirect};
}