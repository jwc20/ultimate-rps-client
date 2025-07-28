export function ActionButtons({numberOfActions, disabled, onPlay}) {
    const getEmojisForGameSize = (size) => {
        const emojiMappings = {
            3: ['🪨', '📄', '✂️'], // Rock, Paper, Scissors
            5: ['🪨', '📄', '✂️', '🦎', '🖖'], // Rock, Paper, Scissors, Lizard, Spock
            7: ['🪨', '🔥', '✂️', '🧽', '📄', '💨', '🌊'], // Rock, Fire, Scissors, Sponge, Paper, Air, Water
            9: ['🪨', '🔥', '✂️', '👤', '🧽', '📄', '💨', '🌊', '🔫'], // Rock, Fire, Scissors, Human, Sponge, Paper, Air, Water, Gun
            11: ['🪨', '🔥', '✂️', '👤', '🐺', '🧽', '📄', '💨', '🌊', '👹', '🔫'], // Rock, Fire, Scissors, Human, Wolf, Sponge, Paper, Air, Water, Devil, Gun
            15: ['🪨', '🔥', '✂️', '🐍', '👤', '🌳', '🐺', '🧽', '📄', '💨', '🌊', '🐉', '👹', '⚡', '🔫'] // Rock, Fire, Scissors, Snake, Human, Tree, Wolf, Sponge, Paper, Air, Water, Dragon, Devil, Lightning, Gun
        };

        return emojiMappings[size] || [];
    };

    const emojis = getEmojisForGameSize(numberOfActions);

    return (
        <div style={{marginTop: 16}}>
            <h4>{disabled ? "Actions (Waiting for others...)" : "Actions"}</h4>
            <div style={{display: "flex", gap: 7.8, flexWrap: "wrap"}}>
                {Array.from({length: numberOfActions}).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => onPlay(index)}
                        disabled={disabled}
                        style={{
                            opacity: disabled ? 0.5 : 1,
                            cursor: disabled ? "not-allowed" : "pointer",
                            fontSize: '20px',
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                        title={getActionName(index, numberOfActions)}
                    >
                        {emojis[index] || `Action ${index + 1}`}
                    </button>
                ))}
            </div>
        </div>
    );
}

function getActionName(index, gameSize) {
    const actionNames = {
        3: ['Rock', 'Paper', 'Scissors'],
        5: ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'],
        7: ['Rock', 'Fire', 'Scissors', 'Sponge', 'Paper', 'Air', 'Water'],
        9: ['Rock', 'Fire', 'Scissors', 'Human', 'Sponge', 'Paper', 'Air', 'Water', 'Gun'],
        11: ['Rock', 'Fire', 'Scissors', 'Human', 'Wolf', 'Sponge', 'Paper', 'Air', 'Water', 'Devil', 'Gun'],
        15: ['Rock', 'Fire', 'Scissors', 'Snake', 'Human', 'Tree', 'Wolf', 'Sponge', 'Paper', 'Air', 'Water', 'Dragon', 'Devil', 'Lightning', 'Gun']
    };

    return actionNames[gameSize]?.[index] || `Action ${index + 1}`;
}