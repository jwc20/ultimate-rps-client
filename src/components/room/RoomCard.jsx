import React from "react";

const RoomCard = ({ room, onJoin }) => {
    const isFull = room.player_count >= room.max_players;

    return (
        <article>
            <header>
                <h4>{room.name}</h4>
            </header>

            <p>
                <small>Actions per turn: {room.number_of_actions}</small>
            </p>
            <p>
                <small>
                    Players: {room.player_count}/{room.max_players} | ID:{" "}
                    {room.id}
                </small>
            </p>

            <footer>
                <button onClick={() => onJoin(room.id)} disabled={isFull}>
                    {isFull ? "Room Full" : "Join Room"}
                </button>
            </footer>
        </article>
    );
};

export default RoomCard;
