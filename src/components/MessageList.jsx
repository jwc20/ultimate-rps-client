import { useRef, useEffect } from "react";

export function MessageList({ messages, currentUser }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div style={{ border: "1px solid #ccc", borderRadius: 4, height: 400, width: 600, overflowY: "auto", marginBottom: 8, padding: 8 }}>
            {messages.map((msg, idx) => {
                const isMe = msg.username === currentUser?.username;
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
                                borderRadius: 8,
                                padding: "8px 12px",
                                maxWidth: "70%",
                                textAlign: isSystem ? "center" : isMe ? "right" : "left",
                                fontStyle: isSystem ? "italic" : "normal",
                            }}
                        >
                            {!isMe && !isSystem && msg.username && (
                                <div style={{ fontWeight: "bold", marginBottom: 2 }}>
                                    {msg.username}
                                </div>
                            )}
                            <div>
                                {msg.type === "play" ? (
                                    <em>{isMe ? "You" : msg.username} played an action.</em>
                                ) : (
                                    msg.message
                                )}
                            </div>
                            {msg.timestamp && (
                                <div style={{ fontSize: "0.75em", color: "#666", marginTop: 4 }}>
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}
