export function GameStatus({ gameState, onReset }) {
  return (
      <div style={{ marginBottom: 16, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}>
          <div>Round: {gameState.currentRound}</div>
          <div>
              Players Ready: {gameState.readyPlayers}/{gameState.totalActive}
          </div>
          {gameState.isEliminated && (
              <div style={{ color: "red" }}>You have been eliminated!</div>
          )}
          {gameState.gameOver && (
              <>
                  <div style={{ fontWeight: "bold" }}>
                      Winner: {gameState.winner}
                  </div>
                  {gameState.winner && (
                      <button onClick={onReset} style={{ marginTop: 8 }}>
                          Play Again
                      </button>
                  )}
              </>
          )}
      </div>
  );
}
