import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";

const UserList = ({ currentPrivateChat, onUserSelect }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Request the list of online users
    socket.emit("getOnlineUsers");

    // Listen for online user updates
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // Listen for typing updates
    socket.on("userTyping", (userId, isTyping) => {
      setOnlineUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, isTyping } : u
        )
      );
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("userTyping");
    };
  }, []);

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-4">Online Users</h3>

      <div className="space-y-1">
        {onlineUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              currentPrivateChat === user.id
                ? "bg-green-100 text-green-800 border border-green-200"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {(user.name || user.username || "U")[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {user.name || user.username}
                </div>
                <div className="text-xs text-gray-500">
                  {user.isTyping ? "typing..." : "online"}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;
