import React from 'react';

const PlayerInfo = ({ user }) => (
    <div className="bg-gray-200 p-4 rounded-lg mb-6">
        <h3 className="font-semibold">Player: {user.name}</h3>
        <p className="text-sm text-gray-600">ID: {user.id}</p>
    </div>
);

export default PlayerInfo;
