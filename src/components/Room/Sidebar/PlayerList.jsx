function PlayersList({players, currentUser, maxPlayers, isHost, onKick}) {
    function handleKick(playerToKick) {
        if (onKick) {
            onKick(playerToKick);
        }
    }

    return (
        <section
            style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "16px",
                minWidth: "200px",
                maxWidth: "200px",
            }}
        >
            <div>Players: {players.length}/{maxPlayers}</div>
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
                        style={{marginBottom: "4px"}}
                    >
                        {player.length > 10 ? player.slice(0, 10) + "..." : player.padEnd(10, " ")}
                        {player === currentUser?.username && (
                            <em> (you)</em>
                        )}
                        {player !== currentUser?.username && isHost && (
                            <button onClick={() => handleKick(player)}>kick</button>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export {PlayersList};