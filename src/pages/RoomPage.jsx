import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../api/apiClient";
import { useRoomWebSocket } from "../hooks/useRoomWebSocket";

import { RoomHeader } from "../components/RoomHeader";
import { RoomMain } from "../components/RoomMain";
import { GameControls } from "../components/GameControl";
import { Chat } from "../components/Chat";

function RoomPage() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState(null);
    const [roomName, setRoomName] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const { wsRef, gameState, setGameState } = useRoomWebSocket(
        roomId,
        user,
        setMessages
    );

    const handleSetRoom = (room) => {
        setRoom(room);
        setRoomName(room.room_name);
    };

    useEffect(() => {
        if (!roomId) return;
        apiClient.get(`/room/${roomId}`).then(handleSetRoom).catch(console.error);
    }, []);

    useEffect(() => {
        if (!wsRef.current) return;

        const ws = wsRef.current;
        const handleOpen = () => setConnectionStatus("connected");
        const handleClose = () => setConnectionStatus("disconnected");
        const handleError = () => setConnectionStatus("error");

        if (ws.readyState === WebSocket.OPEN) {
            setConnectionStatus("connected");
        }

        ws.addEventListener("open", handleOpen);
        ws.addEventListener("close", handleClose);
        ws.addEventListener("error", handleError);

        return () => {
            ws.removeEventListener("open", handleOpen);
            ws.removeEventListener("close", handleClose);
            ws.removeEventListener("error", handleError);
        };
    }, [wsRef.current]);

    const handleSend = (e) => {
        e.preventDefault();
        if (wsRef.current && input.trim() && user?.username) {
            wsRef.current.send(
                JSON.stringify({
                    username: user.username,
                    message: input,
                    type: "message",
                })
            );
            setInput("");
        }
    };

    const handlePlay = (index) => {
        console.log(index);
        if (wsRef.current && !gameState.hasPlayed && !gameState.isEliminated) {
            wsRef.current.send(
                JSON.stringify({
                    username: user.username,
                    message: index,
                    type: "play",
                })
            );
            setGameState((prev) => ({ ...prev, hasPlayed: true }));
        }
    };

    const handleResetGame = () => {
        if (wsRef.current && gameState.gameOver) {
            wsRef.current.send(JSON.stringify({ type: "reset_game" }));
        }
    };

    const handleStartGame = () => {
        if (
            wsRef.current &&
            !gameState.gameActive &&
            gameState.players.length >= 2
        ) {
            wsRef.current.send(JSON.stringify({ type: "start_game" }));
        }
    };

    return (
        <div>
            <div
                style={{
                    paddingBottom: "16px",
                    maxWidth: "600px",
                }}
            >
                <Link to="/lobby">
                    <button>Back to Lobby</button>
                </Link>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                    alignItems: "flex-start",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        padding: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                    }}
                >
                    <Chat
                        messages={messages}
                        user={user}
                        input={input}
                        onInputChange={(e) => setInput(e.target.value)}
                        onSend={handleSend}
                        room={room}
                        gameState={gameState}
                        onPlay={handlePlay}
                    />
                </div>
                <div
                    style={{
                        flex: 1,
                        minWidth: "350px",
                        maxWidth: "600px",
                        padding: "16px",
                        marginBottom: "16px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                    }}
                >
                    <RoomHeader
                        roomId={roomId}
                        roomName={roomName}
                        connectionStatus={connectionStatus}
                    />

                    <RoomMain
                        gameState={gameState}
                        user={user}
                        onResetGame={handleResetGame}
                    />

                    <GameControls
                        gameState={gameState}
                        onStartGame={handleStartGame}
                        onResetGame={handleResetGame}
                    />
                </div>
            </div>
        </div>
    );
}

export { RoomPage };
