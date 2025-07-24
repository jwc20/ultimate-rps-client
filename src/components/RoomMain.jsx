import { GameStatus } from "../components/GameStatus";
import { PlayersList } from "./PlayerList";

function RoomMain({ gameState, user, onResetGame, roomMaxPlayers }) {
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
            />
        </main>
    );
}

export { RoomMain };