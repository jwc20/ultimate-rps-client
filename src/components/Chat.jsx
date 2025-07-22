import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { ActionButtons } from "../components/ActionButtons";

function Chat({
    messages,
    user,
    input,
    onInputChange,
    onSend,
    room,
    gameState,
    onPlay,
}) {
    const showActionButtons =
        room &&
        room.number_of_actions > 0 &&
        !gameState.isEliminated &&
        !gameState.gameOver;

    return (
        <div>
            <div>
                <MessageList messages={messages} currentUser={user} />
                <MessageInput
                    value={input}
                    onChange={onInputChange}
                    onSend={onSend}
                    disabled={gameState.isEliminated}
                />
                {showActionButtons && (
                    <ActionButtons
                        numberOfActions={room.number_of_actions}
                        disabled={gameState.hasPlayed}
                        onPlay={onPlay}
                    />
                )}
            </div>
        </div>
    );
}

export { Chat };
