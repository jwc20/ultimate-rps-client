import { useRef, useEffect } from "react";

export function MessageList({ messages, currentUser }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
                marginBottom: "20px",
            }}
        >
            <div
                style={{
                    paddingTop: "16px",
                    minWidth: "1000px",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        height: "100vh",
                        maxHeight: "500px",
                        overflowY: "auto",
                        paddingTop: "10px",
                        backgroundColor: "#1a1a1a",
                        borderRadius: "6px",
                        // padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {messages.map((msg, index) => {
                            const isSystem = msg.type === "system";
                            const isCurrentUser = msg.username === currentUser;

                            const current_time = msg.timestamp
                                ? new Date(msg.timestamp).toLocaleTimeString(
                                      "en-US",
                                      {
                                          hour12: false,
                                          hour: "numeric",
                                          minute: "numeric",
                                          second: "numeric",
                                      }
                                  )
                                : "";

                            let formatted_message;
                            if (isSystem) {
                                formatted_message = `[${current_time}] ** ${msg.message} **`;
                            } else if (msg.type === "play") {
                                formatted_message = `[${current_time}] <${msg.username}> *played an action*`;
                            } else {
                                formatted_message = `[${current_time}] <${msg.username}> ${msg.message}`;
                            }

                            return (
                                <li
                                    key={index}
                                    style={{
                                        marginBottom: "5px",
                                        wordBreak: "break-word",
                                        backgroundColor:
                                            index % 2 === 0
                                                ? "#333"
                                                : "transparent",
                                        padding: "5px 10px",
                                        color: isSystem ? "#f0e68c" : "#ffffff",
                                        fontStyle: isSystem
                                            ? "italic"
                                            : "normal",
                                        textAlign: isCurrentUser
                                            ? "right"
                                            : "left",
                                    }}
                                >
                                    {formatted_message}
                                </li>
                            );
                        })}
                    </ul>
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
}
