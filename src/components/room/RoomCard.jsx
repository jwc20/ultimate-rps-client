
// Room Card Component
const RoomCard = ({ room, onJoin }) => {
    const isFull = room.player_count >= room.max_players;

    return (
        <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-lg">{room.name}</h4>
            <p className="text-sm text-gray-600 mt-1">
                Actions per turn: {room.number_of_actions}
            </p>
            <p className="text-sm text-gray-600">
                Players: {room.player_count}/{room.max_players} | ID: {room.id}
            </p>
            <button
                onClick={() => onJoin(room.id)}
                disabled={isFull}
                className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
                    isFull
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                {isFull ? "Room Full" : "Join Room"}
            </button>
        </div>
    );
};
