import {GameStatus} from "./Sidebar/GameStatus.jsx";
import {PlayersList} from "./Sidebar/PlayerList.jsx";

function RoomMain({gameState, user, onResetGame, roomMaxPlayers, isHost, onKick}) {
    return (
        <main
            style={{
                display: "flex",
                gap: "32px",
                flexWrap: "wrap",
                justifyContent: "center",
            }}
        >
            <GameStatus
                gameState={gameState}
                onReset={onResetGame}
            />
            <PlayersList
                players={gameState.players}
                maxPlayers={roomMaxPlayers}
                currentUser={user}
                isHost={isHost}
                onKick={onKick}
            />
        </main>
    );
}

export {RoomMain};