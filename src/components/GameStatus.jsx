export function GameStatus({ gameState }) {
    return (
        <div
            style={{
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                padding: "16px",
                minWidth: "200px",
            }}
        >
            <div>Round: {gameState.currentRound}</div>
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
