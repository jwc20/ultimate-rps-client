
// hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

const WS_BASE_URL = "ws://127.0.0.1:8000";

const useWebSocket = (roomId, userId, { onMessage }) => {
    const ws = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!roomId || !userId) return;

        // Connect to WebSocket
        ws.current = new WebSocket(`${WS_BASE_URL}/ws/${roomId}/${userId}`);

        ws.current.onopen = () => {
            console.log("Connected to room");
            setConnected(true);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
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
    }, [roomId, userId, onMessage]);

    const sendMessage = (data) => {
        if (ws.current && connected) {
            ws.current.send(JSON.stringify(data));
        }
    };

    return { sendMessage, connected };
};

export default useWebSocket;
