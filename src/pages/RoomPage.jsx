import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

function RoomPage() {
  const { roomId } = useParams();
  const wsRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!roomId) return;
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to room ${roomId}`);
    };
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
    ws.onclose = () => {
      console.log(`Disconnected from room ${roomId}`);
    };
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (wsRef.current && input.trim()) {
      wsRef.current.send(input);
      setInput("");
    }
  };

  return (
    <div>
      <h3>Room {roomId}</h3>
      <div style={{ border: '1px solid #ccc', height: 200, overflowY: 'auto', marginBottom: 8, padding: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}


export { RoomPage }