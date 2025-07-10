import React from "react";

const RoomHeader = ({ roomInfo, user, roomId, onLeave }) => (
    <header data-theme="dark">
        <nav>
            <ul>
                <li>
                    <h1>Room: {roomInfo.name}</h1>
                </li>
            </ul>
            <ul>
                <li>
                    <button onClick={onLeave} className="contrast">
                        Leave Room
                    </button>
                </li>
            </ul>
        </nav>
    </header>
);

export default RoomHeader;
