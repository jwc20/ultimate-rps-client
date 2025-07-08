import React from 'react';

const ChatMessage = ({ message, isOwnMessage, isSystem }) => {
    const baseClasses = "mb-2 p-3 rounded-lg";
    const classes = isSystem
        ? `${baseClasses} bg-yellow-100 italic text-center`
        : isOwnMessage
            ? `${baseClasses} bg-blue-100 ml-8`
            : `${baseClasses} bg-gray-100 mr-8`;

    return (
        <div className={classes}>
            {isSystem ? (
                <span className="text-sm">{message.message}</span>
            ) : (
                <>
                    <span className="font-semibold">{message.player_name}:</span>
                    <span className="ml-2">{message.message}</span>
                </>
            )}
        </div>
    );
};

export default ChatMessage;
