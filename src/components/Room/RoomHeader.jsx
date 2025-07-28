function RoomHeader({roomId, connectionStatus, roomName, roomMaxPlayers}) {
    return (
        <div style={{marginLeft: 16}}>
            <p><strong>{roomName}</strong> (ID: {roomId}) | Max players: <strong>{roomMaxPlayers}</strong> |
                Status: <strong>{connectionStatus}</strong></p>
        </div>
    );
}

export {RoomHeader};