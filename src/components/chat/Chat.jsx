import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

const Chat = ({ messages, onSendMessage, disabled, playerId }) => {
    const [messageText, setMessageText] = useState("");
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
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">💬 Game Chat</h3>
            <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
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
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={disabled}
                />
                <button
                    type="submit"
                    disabled={disabled || !messageText.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
