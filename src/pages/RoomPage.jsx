import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import useWebSocket from "../hooks/useWebSocket";
import api from "../services/api.js";
import RoomHeader from "../components/room/RoomHeader";
import Chat from "../components/chat/Chat";
import PlayersList from "../components/room/PlayersList";
import LoadingSpinner from "../components/common/LoadingSpinner";

const RoomPage = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [players, setPlayers] = useState([]);
    const [roomInfo, setRoomInfo] = useState({
        name: "",
        numAction: "",
    });

    // Memoize the onMessage callback to prevent infinite re-renders
    const handleWebSocketMessage = useCallback((data) => {
        switch (data.type) {
            case "room_info":
                setRoomInfo({
                    name: data.room_name,
                    numAction: data.number_of_actions,
                });
                setPlayers(data.players);
                break;
            case "message_history":
                setMessages(data.messages);
                break;
            case "chat":
            case "play":
            case "system":
                setMessages((prev) => [...prev, data]);
                break;
            case "players_update":
                setPlayers(data.players);
                break;
            default:
                break;
        }
    }, []); // Empty dependency array since we're using functional updates

    const { sendMessage, connected } = useWebSocket(roomId, user?.id, {
        onMessage: handleWebSocketMessage,
    });

    const handleSendMessage = useCallback(
        (messageText) => {
            sendMessage({
                type: "chat",
                message: messageText,
            });
        },
        [sendMessage]
    );

    const handlePlayMessage = useCallback(
        (messageText) => {
            sendMessage({
                type: "play",
                message: messageText,
            });
        },
        [sendMessage]
    );

    const handleLeaveRoom = async () => {
        try {
            await api.leaveRoom(user.id);
            navigate("/lobby");
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    };

    if (!connected && messages.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <main className="container">
            <RoomHeader
                roomInfo={roomInfo}
                user={user}
                roomId={roomId}
                onLeave={handleLeaveRoom}
            />

            <div className="grid">
                <section>
                    <Chat
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        onPlayMessage={handlePlayMessage}
                        disabled={!connected}
                        playerId={user.id}
                        numAction={Number(roomInfo.numAction)}
                    />
                </section>

                <aside>
                    <PlayersList players={players} currentPlayerId={user.id} />
                </aside>
            </div>
        </main>
    );
};

export default RoomPage;
