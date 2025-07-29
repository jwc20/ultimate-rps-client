export function GameStatus({ gameState }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "16px",
                minWidth: "200px",
            }}
        >
            <div>Game: {gameState.gameNumber}</div>
            <div>Round: {gameState.gameRound}</div>
            <div>
                Players Ready: {gameState.readyPlayers}/{gameState.totalActive}
            </div>
            {gameState.isEliminated && (
                <div style={{ color: "red" }}>You have been eliminated!</div>
            )}
            {gameState.gameOver && gameState.winner && (
                <div style={{ fontWeight: "bold", marginTop: "8px" }}>
                    Winner: {gameState.winner}
                </div>
            )}
        </div>
    );
}
