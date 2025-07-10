import React from "react";

const PlayerInfo = ({ user }) => (
    <article>
        <div>Player: {user.name}</div>
        <div>
            <small>ID: {user.id}</small>
        </div>
    </article>
);

export default PlayerInfo;
