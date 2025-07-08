import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

const Login = ({ onLogin }) => {
    const [playerName, setPlayerName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!playerName.trim()) return;

        setLoading(true);
        try {
            const data = await api.login(playerName);
            onLogin(data.player_id, data.player_name);
        } catch (error) {
            console.error("Login error:", error);
            alert("Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-3xl font-bold text-center mb-6">
                    🎮 Enter Game
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    Choose your player name to start playing!
                </p>
                <div>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Your Player Name"
                        maxLength={20}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !playerName.trim()}
                        className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {loading ? "Entering..." : "Enter Lobby"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;