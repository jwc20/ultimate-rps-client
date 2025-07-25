function RoomHeader({ roomId, connectionStatus, roomName, roomMaxPlayers}) {
  return (
      <header
          style={{
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "1px solid #eee",
          }}
      >
          <h2>{roomName} (ID: {roomId})</h2>
          <h4>Max players: {roomMaxPlayers}</h4>
          <div
              style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
              }}
          >
              <span>
                  Status: <strong>{connectionStatus}</strong>
              </span>
          </div>
      </header>
  );
}

export { RoomHeader };