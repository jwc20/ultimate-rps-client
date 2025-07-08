import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

const Lobby = ({ playerId, playerName, onJoinRoom }) => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState("");
    const [numAction, setNumAction] = useState("");
    const [loading, setLoading] = useState(false);

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

    const handleCreateRoom = async () => {
        if (!newRoomName.trim()) return;

        setLoading(true);
        try {
            const data = await api.createRoom(
                newRoomName,
                maxPlayers,
                numAction,
                playerId
            );
            if (data.success) {
                onJoinRoom(data.room_id, data.number_of_actions);
            }
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Failed to create room");
        } finally {
            setLoading(false);
            setNewRoomName("");
        }
    };

    const handleRoomNameKeyPress = (e) => {
        if (e.key === "Enter") {
            handleCreateRoom();
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            const data = await api.joinRoom(roomId, playerId);
            if (data.success) {
                onJoinRoom(roomId, data.number_of_actions);
            }
        } catch (error) {
            console.error("Error joining room:", error);
            alert("Failed to join room");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">🎮 Game Lobby</h1>

                <div className="bg-gray-200 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold">Player: {playerName}</h3>
                    <p className="text-sm text-gray-600">ID: {playerId}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Create New Room
                    </h2>
                    <div className="block">
                        <div className="flex gap-3">
                            <h2 className="text-1xl font-semibold mb-4">
                                Room Name
                            </h2>
                            <input
                                type="text"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                onKeyPress={handleRoomNameKeyPress}
                                placeholder="Room Name"
                                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <h2 className="text-1xl font-semibold mb-4">
                                Max Players
                            </h2>
                            <input
                                type="text"
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(e.target.value)}
                                placeholder="Default: 10"
                                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <h2 className="text-1xl font-semibold mb-4">
                                Number of Actions
                            </h2>
                            <input
                                type="text"
                                value={numAction}
                                onChange={(e) => setNumAction(e.target.value)}
                                placeholder="Default: 3"
                                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleCreateRoom}
                            disabled={loading || !newRoomName.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            Create Room
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">
                            Available Rooms
                        </h2>
                        <button
                            onClick={loadRooms}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Refresh
                        </button>
                    </div>

                    {rooms.length === 0 ? (
                        <p className="text-gray-500">
                            No rooms available. Create one!
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="border p-4 rounded-lg"
                                >
                                    <h4 className="font-semibold text-lg">
                                        {room.name}
                                    </h4>
                                    <h4 className="font-semibold text-lg">
                                        {room.number_of_actions}
                                    </h4>

                                    <p className="text-sm text-gray-600">
                                        Players: {room.player_count}/
                                        {room.max_players} | ID: {room.id}
                                    </p>
                                    <button
                                        onClick={() => handleJoinRoom(room.id)}
                                        disabled={
                                            room.player_count >=
                                            room.max_players
                                        }
                                        className={`mt-2 px-4 py-2 rounded-lg ${
                                            room.player_count >=
                                            room.max_players
                                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                    >
                                        {room.player_count >= room.max_players
                                            ? "Room Full"
                                            : "Join Room"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lobby;
