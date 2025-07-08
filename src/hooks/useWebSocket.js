import useWebSocket from 'react-use-websocket';
import { useCallback, useEffect } from 'react';

const WS_BASE_URL = "ws://127.0.0.1:8000";

const useWebSocketConnection = (roomId, userId, { onMessage }) => {
    // Create the WebSocket URL, return null if roomId or userId is missing
    // When null, useWebSocket won't attempt to connect
    const socketUrl = roomId && userId ? `${WS_BASE_URL}/ws/${roomId}/${userId}` : null;

    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
    } = useWebSocket(socketUrl, {
        onOpen: () => console.log("Connected to room"),
        onClose: () => console.log("Disconnected from room"),
        onError: (error) => console.error("WebSocket error:", error),
        shouldReconnect: () => true, // Automatically reconnect on connection loss
        reconnectAttempts: 10, // Attempt to reconnect up to 10 times
        reconnectInterval: 3000, // Wait 3 seconds between reconnection attempts
    });

    // Handle incoming messages using lastJsonMessage
    useEffect(() => {
        if (lastJsonMessage && onMessage) {
            onMessage(lastJsonMessage);
        }
    }, [lastJsonMessage, onMessage]);

    // Check if connected (readyState 1 = OPEN)
    const connected = readyState === 1;

    const sendMessage = useCallback((data) => {
        if (connected) {
            sendJsonMessage(data);
        }
    }, [connected, sendJsonMessage]);

    return { sendMessage, connected };
};

export default useWebSocketConnection;
