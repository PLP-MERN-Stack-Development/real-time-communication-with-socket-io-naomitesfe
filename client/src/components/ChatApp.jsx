import { useState, useEffect } from "react";
import RoomList from "./RoomList"; // Make sure default export exists
import ChatRoom from "./ChatRoom";
import UserList from "./UserList"; // Make sure default export exists
import NotificationPanel from "./NotificationPanel"; // Make sure default export exists
import PrivateChat from "./PrivateChat"; // Make sure default export exists
import './Style.css';

export default function ChatApp({ username, socketData }) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [privateChatUser, setPrivateChatUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Reset unread count when notifications are opened
  useEffect(() => {
    if (showNotifications) {
      setUnreadCount(0);
    }
  }, [showNotifications]);

  const handleRoomSelect = (roomId) => {
    setCurrentRoom(roomId);
    setPrivateChatUser(null);
  };

  const handlePrivateChatSelect = (userId) => {
    setPrivateChatUser(userId);
    setCurrentRoom(null);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">💬 Chat App</h1>
              <p className="text-sm text-blue-100">{username}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  socketData.disconnect();
                  window.location.reload();
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Room List & Users */}
        <div className="flex-1 overflow-y-auto">
          <RoomList
            currentRoom={currentRoom}
            onRoomSelect={handleRoomSelect}
            rooms={socketData.rooms || []} // safe fallback
          />
          <UserList
            currentPrivateChat={privateChatUser}
            onUserSelect={handlePrivateChatSelect}
            users={socketData.users || []} // safe fallback
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {showNotifications ? (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        ) : currentRoom ? (
          <ChatRoom
            username={username}
            socketData={socketData}
            roomId={currentRoom}
          />
        ) : privateChatUser ? (
          <PrivateChat
            username={username}
            socketData={socketData}
            to={privateChatUser}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Chat!</h2>
              <p>Select a room or start a private conversation to begin chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
