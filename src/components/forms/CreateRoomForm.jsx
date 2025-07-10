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
      <form onSubmit={handleSubmit}>
        <article>
            <header>
                <h2>Create New Room</h2>
            </header>
            
            <fieldset>
                <label htmlFor="roomName">
                    Room Name
                    <input
                        id="roomName"
                        type="text"
                        value={formData.roomName}
                        onChange={handleChange('roomName')}
                        placeholder="Enter room name"
                        required
                    />
                </label>
    
                <div className="grid">
                    <label htmlFor="maxPlayers">
                        Max Players
                        <input
                            id="maxPlayers"
                            type="number"
                            value={formData.maxPlayers}
                            onChange={handleChange('maxPlayers')}
                            placeholder="Default: 2"
                            min="2"
                            max="100"
                        />
                    </label>
    
                    <label htmlFor="numAction">
                        Number of Actions
                        <input
                            id="numAction"
                            type="number"
                            value={formData.numAction}
                            onChange={handleChange('numAction')}
                            placeholder="Default: 3"
                            min="3"
                            max="99"
                        />
                    </label>
                </div>
    
                <button
                    type="submit"
                    disabled={loading || !formData.roomName.trim()}
                    aria-busy={loading}
                >
                    {loading ? "Creating..." : "Create Room"}
                </button>
            </fieldset>
        </article>
    </form>
    );
};

export default CreateRoomForm;
