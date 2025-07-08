import React from 'react';

const PlayersList = ({ players, currentPlayerId }) => (
    <div className="bg-gray-200 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">👥 Players in Room</h3>
        <div className="space-y-2">
            {players.map((player) => (
                <div
                    key={player.id}
                    className={`bg-white p-3 rounded-lg ${
                        player.id === currentPlayerId ? 'ring-2 ring-blue-500' : ''
                    }`}
                >
                    <span className="font-medium">{player.name}</span>
                    {player.id === currentPlayerId && (
                        <span className="text-sm text-blue-600 ml-2">(You)</span>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default PlayersList;
