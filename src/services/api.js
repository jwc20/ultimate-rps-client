const API_BASE_URL = "http://127.0.0.1:8000";

const api = {
  login: async (playerName) => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: playerName })
    });
    return response.json();
  },
  autoLogin: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auto-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  updatePlayerName: async (playerId, newName) => {
    const response = await fetch(`/api/player/${playerId}/name`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: newName })
    });
    return response.json();
  },

  getRooms: async () => {
    const response = await fetch(`${API_BASE_URL}/api/rooms`);
    return response.json();
  },

  createRoom: async (roomName, maxPlayers, numAction, playerId) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_name: roomName,
        max_players: maxPlayers,
        number_of_actions: numAction,
        player_id: playerId
      })
    });
    return response.json();
  },

  joinRoom: async (roomId, playerId) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: roomId, player_id: playerId })
    });
    return response.json();
  },

  leaveRoom: async (playerId) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/leave?player_id=${playerId}`, {
      method: 'POST'
    });
    return response.json();
  }
};

export default api;
