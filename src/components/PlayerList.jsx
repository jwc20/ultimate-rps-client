
function PlayersList({ players, currentUser }) {
  return (
      <section
          style={{
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              padding: "16px",
              minWidth: "200px",
              maxWidth: "200px",
          }}
      >
          <ul
              style={{
                  listStyle: "none",
                  padding: 0,
                  lineHeight: "1.5",
              }}
          >
              {players.map((player) => (
                  <li
                      key={player}
                      style={{ marginBottom: "4px" }}
                  >
                      {player.length > 10 ? player.slice(0, 10) + "..." : player.padEnd(10, " ")}
                      {player === currentUser?.username && (
                          <em> (you)</em>
                      )}
                  </li>
              ))}
          </ul>
      </section>
  );
}

export { PlayersList };