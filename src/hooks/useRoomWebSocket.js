import { useEffect, useRef, useState } from "react";
import { tokenManager } from "../api/tokenManager";

export function useRoomWebSocket(roomId, user, setMessages) {
    const wsRef = useRef(null);

    const [gameState, setGameState] = useState({
        players: [],
        readyPlayers: 0,
        totalActive: 0,
        isEliminated: false,
        currentRound: 1,
        hasPlayed: false,
        gameOver: false,
        winner: null,
    });

    useEffect(() => {
        if (!roomId) return;
        let isCleaningUp = false;
        const token = tokenManager.getToken();
        const ws = new WebSocket(
            `ws://127.0.0.1:8000/ws/${roomId}?token=${token}`
        );
        wsRef.current = ws;

        ws.onopen = () => {
            if (!isCleaningUp) console.log(`Connected to room ${roomId}`);
        };

        ws.onmessage = (event) => {
            if (isCleaningUp) return;

            let parsed;
            try {
                parsed = JSON.parse(event.data);
            } catch {
                parsed = { message: event.data };
            }

            switch (parsed.type) {
                case "player_joined":
                case "player_left":
                    setGameState((prev) => ({
                        ...prev,
                        players: parsed.players || [],
                    }));
                    break;

                case "player_ready":
                    setGameState((prev) => ({
                        ...prev,
                        readyPlayers: parsed.ready_count,
                        totalActive: parsed.total_active,
                    }));
                    break;

                case "round_complete":
                    setGameState((prev) => ({
                        ...prev,
                        isEliminated: parsed.eliminated.includes(
                            user?.username
                        ),
                        currentRound: parsed.round + 1,
                        hasPlayed: false,
                        readyPlayers: 0,
                    }));
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "system",
                            message: `Round ${
                                parsed.round
                            } complete! Eliminated: ${
                                parsed.eliminated.join(", ") || "None"
                            }`,
                            timestamp: new Date().toISOString(),
                        },
                    ]);
                    break;

                case "game_over":
                    setGameState((prev) => ({
                        ...prev,
                        gameOver: true,
                        winner: parsed.winner,
                    }));
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "system",
                            message: `Game Over! Winner: ${parsed.winner}`,
                            timestamp: new Date().toISOString(),
                        },
                    ]);
                    break;

                case "game_reset":
                    setGameState({
                        players: parsed.players || [],
                        readyPlayers: 0,
                        totalActive: (parsed.players || []).length,
                        isEliminated: false,
                        currentRound: 1,
                        hasPlayed: false,
                        gameOver: false,
                        winner: null,
                    });
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "system",
                            message: "A new game is starting!",
                            timestamp: new Date().toISOString(),
                        },
                    ]);
                    break;

                default:
                    setMessages((prev) => [...prev, parsed]);
            }
        };

        ws.onclose = () => {
            if (!isCleaningUp) console.log(`Disconnected from room ${roomId}`);
        };

        ws.onerror = (err) => {
            if (!isCleaningUp && ws.readyState !== WebSocket.CLOSING) {
                console.error("WebSocket error:", err);
            }
        };

        return () => {
            isCleaningUp = true;
            ws.close();
        };
    }, [roomId, user?.username]);

    return { wsRef, gameState, setGameState };
}
