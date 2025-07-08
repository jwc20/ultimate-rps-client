import React, { useState } from 'react';

const CreateRoomForm = ({ onCreateRoom, loading }) => {
    const [formData, setFormData] = useState({
        roomName: "",
        maxPlayers: "",
        numAction: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.roomName.trim()) return;
        onCreateRoom(formData);
        setFormData({ roomName: "", maxPlayers: "", numAction: "" });
    };

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Create New Room</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Name
                    </label>
                    <input
                        type="text"
                        value={formData.roomName}
                        onChange={handleChange('roomName')}
                        placeholder="Enter room name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Players
                        </label>
                        <input
                            type="number"
                            value={formData.maxPlayers}
                            onChange={handleChange('maxPlayers')}
                            placeholder="Default: 10"
                            min="2"
                            max="20"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Actions
                        </label>
                        <input
                            type="number"
                            value={formData.numAction}
                            onChange={handleChange('numAction')}
                            placeholder="Default: 3"
                            min="1"
                            max="10"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.roomName.trim()}
                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                    {loading ? "Creating..." : "Create Room"}
                </button>
            </div>
        </form>
    );
};

export default CreateRoomForm;
