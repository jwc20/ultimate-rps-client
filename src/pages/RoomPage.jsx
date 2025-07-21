
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { tokenManager } from "../api/tokenManager";
import { LoadingOrEmptyMessage } from "../components/LoadingOrEmptyMessage";
import { apiClient } from "../api/apiClient";

function RoomPage() {
    const { roomId } = useParams();
    const wsRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [room, setRoom] = useState();


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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!roomId) return;
        const fetchRoom = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiClient.get(`/room/${roomId}`);
                setRoom(data);
            } catch (err) {
                setError(err.message || "Failed to fetch room");
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, []);

    useEffect(() => {
        if (!roomId) return;

        let isCleaningUp = false;
        const token = tokenManager.getToken();
        const ws = new WebSocket(
            `ws://127.0.0.1:8000/ws/${roomId}?token=${token}`
        );

        wsRef.current = ws;

        ws.onopen = () => {
            if (!isCleaningUp) {
                console.log(`Connected to room ${roomId}`);
            }
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

                    // Add round result message
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
            if (!isCleaningUp) {
                console.log(`Disconnected from room ${roomId}`);
            }
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

    const handleSend = (e) => {
        e.preventDefault();
        if (wsRef.current && input.trim() && user?.username) {
            const msgObj = {
                username: user.username,
                message: input,
                type: "message",
            };
            wsRef.current.send(JSON.stringify(msgObj));
            setInput("");
        }
    };

    const handlePlay = (actionIndex) => {
        if (
            wsRef.current &&
            user?.username &&
            !gameState.hasPlayed &&
            !gameState.isEliminated
        ) {
            const msgObj = {
                username: user.username,
                type: "play",
                message: actionIndex,
            };
            wsRef.current.send(JSON.stringify(msgObj));
            setGameState((prev) => ({ ...prev, hasPlayed: true }));
        }
    };

    const handleResetGame = () => {
        if (wsRef.current && gameState.gameOver) {
            const msgObj = { type: "reset_game" };
            wsRef.current.send(JSON.stringify(msgObj));
        }
    };

    return (
        <div>
            <Link to={`/lobby`}>
                <button>back</button>
            </Link>
            <h3>Room {roomId}</h3>

            {/* Game Status */}
            <div
                style={{
                    marginBottom: 16,
                    padding: 8,
                    // background: "#1a1a1a",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                }}
            >
                <div>Round: {gameState.currentRound}</div>
                <div>
                    Players Ready: {gameState.readyPlayers}/
                    {gameState.totalActive}
                </div>
                {gameState.isEliminated && (
                    <div style={{ color: "red" }}>
                        You have been eliminated!
                    </div>
                )}
                {gameState.gameOver && (
                    <div style={{ fontWeight: "bold" }}>
                        Winner: {gameState.winner}
                    </div>
                )}
                {gameState.gameOver && gameState.winner && (
                    <button onClick={handleResetGame} style={{ marginTop: 8 }}>
                        Play Again
                    </button>
                )}
            </div>

            <div
                style={{
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    justifyContent: "center",
                    height: 400,
                    width: 600,
                    overflowY: "auto",
                    marginBottom: 8,
                    padding: 8,
                    position: "relative",
                }}
            >
                {messages.map((msg, idx) => {
                    const isMe =
                        msg.username &&
                        user?.username &&
                        msg.username === user.username;
                    const isSystem = msg.type === "system";

                    return (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                justifyContent: isSystem
                                    ? "center"
                                    : isMe
                                    ? "flex-end"
                                    : "flex-start",
                                marginBottom: 8,
                            }}
                        >
                            <div
                                style={{
                                    background: isSystem
                                        ? "#fffacd"
                                        : isMe
                                        ? "#d1e7dd"
                                        : "#f1f1f1",
                                    color: "#222",
                                    borderRadius: 8,
                                    padding: "8px 12px",
                                    maxWidth: "70%",
                                    textAlign: isSystem
                                        ? "center"
                                        : isMe
                                        ? "right"
                                        : "left",
                                    fontStyle: isSystem ? "italic" : "normal",
                                }}
                            >
                                {!isMe && !isSystem && msg.username ? (
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: 2,
                                        }}
                                    >
                                        {msg.username}
                                    </div>
                                ) : null}
                                {msg.type === "play" ? (
                                    <em>
                                        {isMe ? "You" : msg.username} played an
                                        action.
                                    </em>
                                ) : (
                                    <div>{msg.message}</div>
                                )}
                                {msg.timestamp && (
                                    <div
                                        style={{
                                            fontSize: "0.75em",
                                            color: "#666",
                                            marginTop: 4,
                                        }}
                                    >
                                        {new Date(
                                            msg.timestamp
                                        ).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: "8px" }}
                    disabled={gameState.isEliminated}
                />
                <button
                    type="submit"
                    style={{ padding: "8px 16px" }}
                    disabled={gameState.isEliminated}
                >
                    Send
                </button>
            </form>

            {room &&
                room.number_of_actions > 0 &&
                !gameState.isEliminated &&
                !gameState.gameOver && (
                    <div style={{ marginTop: 16 }}>
                        <h4>
                            Actions{" "}
                            {gameState.hasPlayed &&
                                "(Waiting for other players...)"}
                        </h4>
                        <div style={{ display: "flex", gap: 8 }}>
                            {Array.from({ length: room.number_of_actions }).map(
                                (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePlay(index)}
                                        disabled={gameState.hasPlayed}
                                        style={{
                                            opacity: gameState.hasPlayed
                                                ? 0.5
                                                : 1,
                                            cursor: gameState.hasPlayed
                                                ? "not-allowed"
                                                : "pointer",
                                        }}
                                    >
                                        Action {index + 1}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
}

export { RoomPage };
