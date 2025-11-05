import { useState } from "react";

export function RoomList({ currentRoom, onRoomSelect, socket }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [rooms, setRooms] = useState(["General"]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const roomName = newRoomName.trim();
    setRooms((prev) => [...prev, roomName]);
    setNewRoomName("");
    setShowCreateForm(false);

    // Join new room via socket
    if (socket) {
      socket.emit("join_room", roomName);
    }
    onRoomSelect(roomName);
  };

  const handleJoinRoom = (room) => {
    if (socket) {
      socket.emit("join_room", room);
    }
    onRoomSelect(room);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Rooms</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + New Room
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreateRoom}
          className="mb-4 p-3 bg-gray-50 rounded-lg"
        >
          <input
            type="text"
            placeholder="Room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-1">
        {rooms.map((room, i) => (
          <button
            key={i}
            onClick={() => handleJoinRoom(room)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              currentRoom === room
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">#</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{room}</div>
                <div className="text-xs text-gray-500 truncate">
                  Public room
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
export default RoomList;