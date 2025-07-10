import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

const Chat = ({
    messages,
    onSendMessage,
    onPlayMessage,
    disabled,
    playerId,
    numAction,
}) => {
    const [messageText, setMessageText] = useState("");
    const [actionTaken, setActionTaken] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!messageText.trim() || disabled) return;
        onSendMessage(messageText);
        setMessageText("");
    };

    return (
        <article>
            <header>
                <h3>TODO - show numAction here</h3>
            </header>

            <div
                style={{
                    height: "24rem",
                    overflowY: "auto",
                    padding: "1rem",
                    backgroundColor: "var(--pico-background-color)",
                    border: "1px solid var(--pico-border-color)",
                    borderRadius: "var(--pico-border-radius)",
                    marginBottom: "1rem",
                }}
            >
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        message={msg}
                        isOwnMessage={msg.player_id === playerId}
                        isSystem={msg.type === "system"}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit}>
                <fieldset role="group">
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        disabled={disabled}
                    />
                    <button
                        type="submit"
                        disabled={disabled || !messageText.trim()}
                    >
                        Send
                    </button>
                </fieldset>
            </form>

            <div role="group">
                {Array.from({ length: numAction }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setActionTaken(true);
                            onPlayMessage(`${index}`);
                        }}
                        disabled={disabled || actionTaken}
                    >
                        Action {index}
                    </button>
                ))}
            </div>
        </article>
    );
};

export default Chat;
