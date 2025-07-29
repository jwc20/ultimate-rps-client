import {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {apiClient} from "../api/apiClient";
import {useRoomWebSocket} from "../hooks/useRoomWebSocket";

import {RoomHeader} from "../components/Room/RoomHeader.jsx";
import {RoomMain} from "../components/Room/RoomMain.jsx";
import {GameControls} from "../components/Room/Sidebar/GameControl.jsx";
import {Chat} from "../components/Room/Main/Chat.jsx";
import {ActionGraph} from "../components/Room/ActionGraph.jsx";
import {ActionButtons} from "../components/Room/Main/ActionButtons.jsx";
import { useLocation, Navigate, redirect, useNavigate } from "react-router-dom";


function RoomPage() {
    const {roomId} = useParams();
    const {user} = useAuth();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState(null);
    const [roomName, setRoomName] = useState("");
    const [roomMaxPlayers, setRoomMaxPlayers] = useState(0);
    const [roomNumberOfActions, setRoomNumberOfActions] = useState(0);
    const [isHost, setIsHost] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const {wsRef, gameState, setGameState, shouldRedirect} = useRoomWebSocket(roomId, user, setMessages);
    const navigate = useNavigate();

    // console.log(gameState);

    const handleSetRoom = (room) => {
        setRoom(room);
        setRoomName(room.room_name);
        setRoomMaxPlayers(room.max_players);
        setRoomNumberOfActions(room.number_of_actions);
        setIsHost(room.created_by === user.id);
    };

    useEffect(() => {
        if (shouldRedirect) {
            navigate("/lobby");
        }
    }, [shouldRedirect, navigate]);


    useEffect(() => {
        if (!roomId) return;
        apiClient.get(`/room/${roomId}`).then(handleSetRoom).catch(console.error);
    }, []);

    useEffect(() => {
        if (!wsRef.current) return;

        const ws = wsRef.current;
        const handleOpen = () => setConnectionStatus("connected");
        const handleClose = () => setConnectionStatus("disconnected");
        const handleError = () => setConnectionStatus("error");

        if (ws.readyState === WebSocket.OPEN) {
            setConnectionStatus("connected");
        }

        ws.addEventListener("open", handleOpen);
        ws.addEventListener("close", handleClose);
        ws.addEventListener("error", handleError);

        return () => {
            ws.removeEventListener("open", handleOpen);
            ws.removeEventListener("close", handleClose);
            ws.removeEventListener("error", handleError);
        };
    }, [wsRef.current]);

    const handleSend = (e) => {
        e.preventDefault();
        if (wsRef.current && input.trim() && user?.username) {
            wsRef.current.send(JSON.stringify({
                username: user.username, message: input, type: "message",
            }));
            setInput("");
        }
    };

    const handlePlay = (index) => {
        console.log(index);
        if (wsRef.current && !gameState.hasPlayed && !gameState.isEliminated) {
            wsRef.current.send(JSON.stringify({
                username: user.username, message: index, type: "play",
            }));
            setGameState((prev) => ({...prev, hasPlayed: true}));
        }
    };

    const handleResetGame = () => {
        if (wsRef.current && gameState.gameOver) {
            wsRef.current.send(JSON.stringify({type: "reset_game"}));
        }
    };

    const handleStartGame = () => {
        if (wsRef.current && !gameState.gameActive && gameState.players.length >= 2) {
            wsRef.current.send(JSON.stringify({type: "start_game"}));
        }
    };

    const handlePlayerKick = (playerToKick) => {
        if (wsRef.current && isHost) {
            wsRef.current.send(JSON.stringify({
                type: "kick_player",
                username: user.username,
                target: playerToKick,
            }));
        }
    };

    return (
        <>
            <div style={styles.backButtonContainer}>
                <Link to="/lobby">
                    <button>Back to Lobby</button>
                </Link>
            </div>

            <div style={styles.mainContainer}>
                <div style={styles.roomHeaderContainer}>
                    <RoomHeader
                        roomId={roomId}
                        roomName={roomName}
                        roomMaxPlayers={roomMaxPlayers}
                        connectionStatus={connectionStatus}
                    />
                </div>
                <div style={styles.withSidebar}>
                    <div style={styles.withSidebarFirstChild}>
                        <div style={styles.chatContainer}>
                            <Chat
                                messages={messages}
                                user={user}
                                input={input}
                                onInputChange={(e) => setInput(e.target.value)}
                                onSend={handleSend}
                                room={room}
                                gameState={gameState}
                                onPlay={handlePlay}
                            />
                        </div>
                    </div>

                    <div style={styles.withSidebarLastChild}>
                        <div style={styles.roomMainContainer}>
                            <RoomMain
                                gameState={gameState}
                                user={user}
                                roomMaxPlayers={roomMaxPlayers}
                                onResetGame={handleResetGame}
                                isHost={isHost}
                                onKick={handlePlayerKick}
                            />

                            <GameControls
                                gameState={gameState}
                                onStartGame={handleStartGame}
                                onResetGame={handleResetGame}
                            />
                        </div>
                    </div>
                </div>
                <div style={styles.actionGraphContainer}>
                    <ActionGraph />
                </div>
            </div>
        </>
    );
}

const styles = {
    backButtonContainer: {
        paddingBottom: "16px",
        maxWidth: "600px",
    },
    mainContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "flex-start",
        width: "100%",
    },
    roomHeaderContainer: {
        border: "1px solid #ccc",
        borderRadius: "6px",
        width: "100%",
    },
    chatContainer: {
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--s1)",
    },
    roomMainContainer: {
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "6px",
    },
    withSidebar: {
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
    },
    withSidebarFirstChild: {
        flexGrow: 1,
    },
    withSidebarLastChild: {
        flexBasis: 0,
        flexGrow: 999,
        minInlineSize: "20%",
    },
    actionGraphContainer: {
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--s1)",
        width: "100%",
        // maxWidth: "600px",
        marginTop: "16px",
    }
};

export {RoomPage};