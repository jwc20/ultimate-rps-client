import { useEffect, useState, useRef } from "react";
import { apiClient } from "../api/apiClient";
import { Link } from "react-router-dom";

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiClient.get("/rooms");
                setRooms(data);
            } catch (err) {
                setError(err.message || "Failed to fetch rooms");
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                margin: "10px",
                padding: "10px",
            }}
        >
            <h4>Rooms</h4>
            {loading && <div>Loading rooms...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <ul>
                {rooms.map((room) => (
                    <li key={room.id}>
                        <span>
                            {room.room_name} | Max Players: {room.max_players} | Actions: {room.number_of_actions} (ID: {room.id})
                        </span>
                        <Link to={`/room/${room.id}`}>
                            <button style={{ marginLeft: "10px" }}>Join</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export { Rooms };
