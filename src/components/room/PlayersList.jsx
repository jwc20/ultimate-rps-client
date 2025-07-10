import React from 'react';

const PlayersList = ({ players, currentPlayerId }) => (
    <article>
        <header>
            <h3>👥 Players in Room</h3>
        </header>
        <div>
            {players.map((player) => (
                <div 
                    key={player.id} 
                    style={{
                        padding: '0.5rem',
                        marginBottom: '0.25rem',
                        borderRadius: 'var(--pico-border-radius)',
                        backgroundColor: player.id === currentPlayerId 
                            ? 'var(--pico-primary-background)' 
                            : 'var(--pico-secondary-background)',
                        color: player.id === currentPlayerId 
                            ? 'var(--pico-primary-inverse)' 
                            : 'var(--pico-color)',
                        border: '1px solid var(--pico-border-color)'
                    }}
                >
                    <span>{player.name}</span>
                    {player.id === currentPlayerId && (
                        <span> (You)</span>
                    )}
                </div>
            ))}
        </div>
    </article>
);

export default PlayersList;