
import { CreateRoom } from "../components/CreateRoom";
import { Rooms } from "../components/Rooms";

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