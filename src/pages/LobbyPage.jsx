import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api';
import PlayerInfo from '../components/common/PlayerInfo';
import CreateRoomForm from '../components/forms/CreateRoomForm';
import RoomCard from '../components/room/RoomCard';

const LobbyPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const loadRooms = useCallback(async () => {
        try {
            const data = await api.getRooms();
            setRooms(data);
        } catch (error) {
            console.error("Error loading rooms:", error);
        }
    }, []);

    useEffect(() => {
        loadRooms();
        const interval = setInterval(loadRooms, 5000);
        return () => clearInterval(interval);
    }, [loadRooms]);

    const handleCreateRoom = async ({ roomName, maxPlayers, numAction }) => {
        setLoading(true);
        try {
            const data = await api.createRoom(roomName, maxPlayers, numAction, user.id);
            if (data.success) {
                navigate(`/room/${data.room_id}`);
            }
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Failed to create room");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            const data = await api.joinRoom(roomId, user.id);
            if (data.success) {
                navigate(`/room/${roomId}`);
            }
        } catch (error) {
            console.error("Error joining room:", error);
            alert("Failed to join room");
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">🎮 Game Lobby</h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <PlayerInfo user={user} />

                <CreateRoomForm onCreateRoom={handleCreateRoom} loading={loading} />

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Available Rooms</h2>
                        <button
                            onClick={loadRooms}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>

                    {rooms.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No rooms available. Create one to get started!
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rooms.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    onJoin={handleJoinRoom}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LobbyPage;
