import { useState } from 'react';
import { apiClient } from '../api/apiClient';

function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [numberOfActions, setNumberOfActions] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      const response = await apiClient.post('/create-room', data);
      setSuccess(`Room created! ID: ${response.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Create room</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Name:</label>
          <input
            type="text"
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Max Players:</label>
          <input
            type="number"
            min="2"
            max="10"
            value={maxPlayers}
            onChange={e => setMaxPlayers(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Number of Actions:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={numberOfActions}
            onChange={e => setNumberOfActions(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Room'}
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </div>
  );
}

export {CreateRoom}
