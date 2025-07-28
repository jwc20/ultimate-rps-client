
import { CreateRoom } from "../components/Lobby/CreateRoom.jsx";
import { Rooms } from "../components/Lobby/Rooms.jsx";

function LobbyPage() {
  return (
    <div className="page">
        <h3>Lobby</h3>
        <CreateRoom />
        <Rooms />
    </div>
  )
}

export { LobbyPage };