import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

const WS_BASE_URL = "ws://127.0.0.1:8000";

const Room = ({ roomId, playerId, playerName, onLeaveRoom }) => {
    const [messages, setMessages] = useState([]);
    const [players, setPlayers] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState("");
    const [numAction, setNumAction] = useState("");
    const [messageText, setMessageText] = useState("");
    const [connected, setConnected] = useState(false);
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Connect to WebSocket
        ws.current = new WebSocket(`${WS_BASE_URL}/ws/${roomId}/${playerId}`);

        ws.current.onopen = () => {
            console.log("Connected to room");
            setConnected(true);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleMessage(data);
        };

        ws.current.onclose = () => {
            console.log("Disconnected from room");
            setConnected(false);
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [roomId, playerId]);

    const handleMessage = (data) => {
        console.log("data", data)
        switch (data.type) {
            case "room_info":
                setRoomName(data.room_name);
                setNumAction(data.number_of_actions);
                setPlayers(data.players);
                break;
            case "message_history":
                setMessages(data.messages);
                break;
            case "chat":
            case "system":
                setMessages((prev) => [...prev, data]);
                break;
            case "players_update":
                setPlayers(data.players);
                break;
            default:
                break;
        }
    };

    const sendMessage = () => {
        if (!messageText.trim() || !connected) return;

        ws.current.send(
            JSON.stringify({
                type: "chat",
                message: messageText,
            })
        );
        setMessageText("");
    };

    const handleMessageKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const handleLeaveRoom = async () => {
        try {
            await api.leaveRoom(playerId);
            onLeaveRoom();
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {roomName || "Room"}
                            </h1>
                            <p>
                                Player: {playerName} | Room ID: {roomId}
                            </p>
                            <p>
                                Number of Actions: {numAction}
                            </p>
                        </div>
                        <button
                            onClick={handleLeaveRoom}
                            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Leave Room
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">
                                💬 Game Chat
                            </h3>
                            <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`mb-2 p-2 rounded ${
                                            msg.type === "system"
                                                ? "bg-yellow-100 italic"
                                                : msg.player_id === playerId
                                                ? "bg-blue-100 ml-8"
                                                : "bg-gray-100 mr-8"
                                        }`}
                                    >
                                        {msg.type === "chat" ? (
                                            <>
                                                <strong>
                                                    {msg.player_name}:
                                                </strong>{" "}
                                                {msg.message}
                                            </>
                                        ) : (
                                            msg.message
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) =>
                                        setMessageText(e.target.value)
                                    }
                                    onKeyPress={handleMessageKeyPress}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!connected}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!connected || !messageText.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-200 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">
                            👥 Players in Room
                        </h3>
                        <div className="space-y-2">
                            {players.map((player) => (
                                <div
                                    key={player.id}
                                    className="bg-white p-2 rounded"
                                >
                                    {player.name}{" "}
                                    {player.id === playerId && "(You)"}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;