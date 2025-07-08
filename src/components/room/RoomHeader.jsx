import React from 'react';

const RoomHeader = ({ roomInfo, user, roomId, onLeave }) => (
    <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">
                    {roomInfo.name || "Room"}
                </h1>
                <p>Player: {user.name} | Room ID: {roomId}</p>
                <p>Number of Actions: {roomInfo.numAction}</p>
            </div>
            <button
                onClick={onLeave}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
                Leave Room
            </button>
        </div>
    </div>
);

export default RoomHeader;
