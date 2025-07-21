import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { tokenManager } from "../api/tokenManager";

function RoomPage() {
    const { roomId } = useParams();
    const wsRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            setMessages((prev) => [...prev, parsed]);
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
                    height: 400,
                    overflowY: "auto",
                    marginBottom: 8,
                    padding: 8,
                    position: "relative",
                }}
            >
                {isLoadingHistory && messages.length === 0 && (
                    <div style={{ textAlign: "center", color: "#666" }}>
                        Loading chat history...
                    </div>
                )}

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
                                marginBottom: 8,
                            }}
                        >
                            <div
                                style={{
                                    background: isMe ? "#d1e7dd" : "#f1f1f1",
                                    color: "#222",
                                    borderRadius: 8,
                                    padding: "8px 12px",
                                    maxWidth: "70%",
                                    textAlign: isMe ? "right" : "left",
                                }}
                            >
                                {!isMe && msg.username ? (
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: 2,
                                        }}
                                    >
                                        {msg.username}
                                    </div>
                                ) : null}
                                <div>{msg.message}</div>
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
                />
                <button type="submit" style={{ padding: "8px 16px" }}>
                    Send
                </button>
            </form>
        </div>
    );
}

export { RoomPage };
