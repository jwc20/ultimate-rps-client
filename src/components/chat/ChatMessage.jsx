import React from "react";

const ChatMessage = ({ message, isOwnMessage, isSystem }) => {
    const baseStyle = {
        marginBottom: '0.5rem',
        padding: '0.75rem',
        borderRadius: 'var(--pico-border-radius)',
        border: '1px solid var(--pico-border-color)'
    };

    const systemStyle = {
        ...baseStyle,
        backgroundColor: 'var(--pico-warning-background-color)',
        textAlign: 'center',
        fontStyle: 'italic'
    };

    const ownMessageStyle = {
        ...baseStyle,
        backgroundColor: 'var(--pico-primary-background)',
        marginLeft: '2rem',
        marginRight: '0'
    };

    const otherMessageStyle = {
        ...baseStyle,
        backgroundColor: 'var(--pico-background-color)',
        marginLeft: '0',
        marginRight: '2rem'
    };

    const style = isSystem 
        ? systemStyle 
        : isOwnMessage 
        ? ownMessageStyle 
        : otherMessageStyle;

    return (
        <div style={style}>
            {isSystem ? (
                <small>{message.message}</small>
            ) : (
                <>
                    <strong>{message.player_name}:</strong> {message.message}
                </>
            )}
        </div>
    );
};

export default ChatMessage;