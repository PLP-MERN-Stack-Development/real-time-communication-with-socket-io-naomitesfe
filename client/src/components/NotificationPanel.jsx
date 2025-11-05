import { useState, useEffect } from "react";
import { useSocket } from "../socket/socket"; // Adjust path if needed

export default function NotificationPanel({ onClose }) {
  const { messages, lastMessage, users } = useSocket();
  const [notifications, setNotifications] = useState([]);

  // Add new messages or events as notifications
  useEffect(() => {
    if (lastMessage) {
      setNotifications((prev) => [
        {
          id: lastMessage.id,
          title: lastMessage.isPrivate ? "Private Message" : "New Message",
          message: lastMessage.message,
          type: lastMessage.isPrivate ? "private_message" : "new_message",
          isRead: false,
          timestamp: lastMessage.timestamp,
        },
        ...prev,
      ]);
    }
  }, [lastMessage]);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  !notification.isRead ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {notification.type === "new_message" && "💬"}
                    {notification.type === "private_message" && "📩"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🔔</div>
              <p>No notifications yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
