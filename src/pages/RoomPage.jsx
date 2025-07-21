import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

function RoomPage() {
    const { roomId } = useParams();
    const wsRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        if (!roomId) return;
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log(`Connected to room ${roomId}`);
        };
        ws.onmessage = (event) => {
            let parsed;
            try {
                parsed = JSON.parse(event.data);
            } catch {
                parsed = { message: event.data };
            }
            setMessages((prev) => [...prev, parsed]);
        };
        ws.onclose = () => {
            console.log(`Disconnected from room ${roomId}`);
        };
        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        return () => {
            ws.close();
        };
    }, [roomId]);

    const handleSend = (e) => {
        e.preventDefault();
        if (wsRef.current && input.trim() && user?.username) {
            const msgObj = { username: user.username, message: input };
            wsRef.current.send(JSON.stringify(msgObj));
            setInput("");
        }
    };

    return (
        <div>
            <Link to={`/lobby`}>
                <button>back</button>
            </Link>
            <h3>Room {roomId}</h3>

            <div
                style={{
                    border: "1px solid #ccc",
                    height: 200,
                    overflowY: "auto",
                    marginBottom: 8,
                    padding: 8,
                }}
            >
                {messages.map((msg, idx) => {
                    const isMe =
                        msg.username &&
                        user?.username &&
                        msg.username === user.username;
                    return (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                justifyContent: isMe
                                    ? "flex-end"
                                    : "flex-start",
                                marginBottom: 4,
                            }}
                        >
                            <div
                                style={{
                                    background: isMe ? "#d1e7dd" : "#f1f1f1",
                                    color: "#222",
                                    borderRadius: 8,
                                    padding: "4px 10px",
                                    maxWidth: "70%",
                                    textAlign: isMe ? "right" : "left",
                                }}
                            >
                                {!isMe && msg.username ? (
                                    <b>{msg.username}: </b>
                                ) : null}
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
            </div>
            <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1 }}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export { RoomPage };
