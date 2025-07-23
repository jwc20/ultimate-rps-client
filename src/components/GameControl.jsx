function GameControls({ gameState, onStartGame, onResetGame }) {
    const canStartGame =
        !gameState.gameActive &&
        !gameState.gameOver &&
        gameState.players.length >= 2;

    const canResetGame = gameState.gameOver && gameState.winner;

    if (!canStartGame && !canResetGame) {
        return null;
    }

    return (
        <footer style={{ marginTop: "24px" }}>
            {/* {canStartGame && (
                <button
                    onClick={onStartGame}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    Start Game
                </button>
            )} */}
            {canResetGame && (
                <button
                    onClick={onResetGame}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    Play Again
                </button>
            )}
        </footer>
    );
}

export { GameControls };
