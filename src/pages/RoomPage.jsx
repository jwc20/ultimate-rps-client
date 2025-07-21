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
          console.log(data)
          setRoom(data);
        } catch (err) {
          setError(err.message || 'Failed to fetch room');
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
            const msgObj = { username: user.username, message: input, type: 'message' };
            wsRef.current.send(JSON.stringify(msgObj));
            setInput("");
        }
    };

    const handlePlay = (actionIndex) => {
        if (wsRef.current && user?.username) {

            const msgObj = {
                username: user.username,
                type: "play",
                message: actionIndex,
            };
            wsRef.current.send(JSON.stringify(msgObj));
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
                    justifyContent: "center",
                    height: 400,
                    width:600,
                    overflowY: "auto",
                    marginBottom: 8,
                    padding: 8,
                    position: "relative",
                }}
            >
                {isLoadingHistory && messages.length === 0 ? (
                    <LoadingOrEmptyMessage />
                ) : null}

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
                />
                <button type="submit" style={{ padding: "8px 16px" }}>
                    Send
                </button>
            </form>

            {room && room.number_of_actions > 0 && (
                <div style={{ marginTop: 16 }}>
                    <h4>Actions</h4>
                    <div style={{ display: "flex", gap: 8 }}>
                        {Array.from({ length: room.number_of_actions }).map(
                            (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePlay(index)}
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
