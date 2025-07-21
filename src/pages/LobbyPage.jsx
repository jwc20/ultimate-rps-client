
import { CreateRoom } from "../components/CreateRoom";
import { Rooms } from "../components/Rooms";

function LobbyPage() {
  return (
    <div className="page">
        <h3>Lobby Page</h3>
        <p>This is the lobby page</p>
        <CreateRoom />
        <Rooms />
    </div>
  )
}

export { LobbyPage };