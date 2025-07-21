import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../api/apiClient";
import { useRoomWebSocket } from "../hooks/useRoomWebSocket";
import { GameStatus } from "../components/GameStatus";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { ActionButtons } from "../components/ActionButtons";

function RoomPage() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState(null);
    const { wsRef, gameState, setGameState } = useRoomWebSocket(roomId, user, setMessages);

    useEffect(() => {
        if (!roomId) return;
        apiClient.get(`/room/${roomId}`).then(setRoom).catch(console.error);
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (wsRef.current && input.trim() && user?.username) {
            wsRef.current.send(JSON.stringify({
                username: user.username,
                message: input,
                type: "message",
            }));
            setInput("");
        }
    };

    const handlePlay = (index) => {
        if (wsRef.current && !gameState.hasPlayed && !gameState.isEliminated) {
            wsRef.current.send(JSON.stringify({
                username: user.username,
                message: index,
                type: "play",
            }));
            setGameState((prev) => ({ ...prev, hasPlayed: true }));
        }
    };

    const handleResetGame = () => {
        if (wsRef.current && gameState.gameOver) {
            wsRef.current.send(JSON.stringify({ type: "reset_game" }));
        }
    };

    return (
        <div>
            <Link to="/lobby"><button>Back</button></Link>
            <h3>Room {roomId}</h3>

            <GameStatus gameState={gameState} onReset={handleResetGame} />
            <MessageList messages={messages} currentUser={user} />
            <MessageInput value={input} onChange={(e) => setInput(e.target.value)} onSend={handleSend} disabled={gameState.isEliminated} />
            {room && room.number_of_actions > 0 && !gameState.isEliminated && !gameState.gameOver && (
                <ActionButtons numberOfActions={room.number_of_actions} disabled={gameState.hasPlayed} onPlay={handlePlay} />
            )}
        </div>
    );
}

export { RoomPage };
