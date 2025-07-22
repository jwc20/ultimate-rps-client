import { useState } from "react";
import { apiClient } from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function CreateRoom() {
    const [roomName, setRoomName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [numberOfActions, setNumberOfActions] = useState(3);
    const [numberOfActionsError, setNumberOfActionsError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = {
                room_name: roomName,
                max_players: maxPlayers,
                number_of_actions: numberOfActions,
            };
            const response = await apiClient.post("/create-room", data);
            setSuccess(`Room created! ID: ${response.id}`);
            if (response.id) {
                navigate(`/room/${response.id}`);
            }
        } catch (err) {
            setError(err.message || "Failed to create room");
        } finally {
            setLoading(false);
        }
    };

    const handleNumberOfActionsChange = (e) => {
        const value = Number(e.target.value);
        if (value < 3) {
            setNumberOfActions(3);
            setNumberOfActionsError("Number of actions must be at least 3.");
        } else if (value % 2 === 0) {
            setNumberOfActions(value + 1);
            setNumberOfActionsError("Number of actions must be an odd number.");
        } else {
            setNumberOfActions(value);
            setNumberOfActionsError(null);
        }
    };

    const handleMaxPlayersChange = (e) => {
        const value = Number(e.target.value);
        setMaxPlayers(value < 2 ? 2 : value);
    };

    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                margin: "10px",
                padding: "10px",
            }}
        >
            <div style={{ margin: "10px", padding: "10px" }}>
                <h3>Create room</h3>
                {!isAuthenticated && !authLoading ? (
                    <div style={{ color: "red", marginBottom: "10px" }}>
                        You must be logged in to create a room.
                    </div>
                ) : null}
                <form onSubmit={handleSubmit}>
                    <div style={{ padding: "10px 0" }}>
                        <label>Room Name:</label>
                        <input
                            style={{ margin: "0 10px" }}
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                            disabled={
                                !isAuthenticated || loading || authLoading
                            }
                        />
                    </div>
                    <div style={{ padding: "10px 0" }}>
                        <label>Max Players:</label>
                        <input
                            style={{ margin: "0 10px" }}
                            type="number"
                            min="2"
                            max="10"
                            value={maxPlayers}
                            onChange={handleMaxPlayersChange}
                            required
                            disabled={!isAuthenticated || loading || authLoading}
                        />
                    </div>
                    <div style={{ padding: "10px 0" }}>
                        <label>Number of Actions:</label>
                        <input
                            style={{ margin: "0 10px" }}
                            type="number"
                            min="3"
                            max="10"
                            step="2"
                            value={numberOfActions}
                            onChange={handleNumberOfActionsChange}
                            required
                            disabled={!isAuthenticated || loading || authLoading}
                        />
                        {numberOfActionsError && (
                            <div style={{ color: "red" }}>{numberOfActionsError}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !isAuthenticated || authLoading}
                        style={{ marginTop: "10px" }}
                    >
                        {loading ? "Creating..." : "Create Room"}
                    </button>
                </form>
                {error && <div style={{ color: "red" }}>{error}</div>}
                {success && <div style={{ color: "green" }}>{success}</div>}
            </div>
        </div>
    );
}

export { CreateRoom };
