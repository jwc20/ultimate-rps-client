import { GameStatus } from "../components/GameStatus";
import { PlayersList } from "./PlayerList";

function RoomMain({ gameState, user, onResetGame }) {
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
                currentUser={user}
            />
        </main>
    );
}

export { RoomMain };