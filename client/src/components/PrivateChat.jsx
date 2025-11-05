import { useState, useEffect, useRef } from "react";
import { useSocket } from "../socket/socket";
import MessageInput from "./MessageInput";

export default function PrivateChat({ userId }) {
  const messagesEndRef = useRef(null);
  const { messages, sendPrivateMessage, setTyping, users } = useSocket();
  const [privateMessages, setPrivateMessages] = useState([]);

  const otherUser = users.find((u) => u._id === userId);

  // Filter private messages for this conversation
  useEffect(() => {
    const filtered = messages.filter(
      (msg) =>
        msg.isPrivate &&
        ((msg.senderId === userId) || (msg.receiverId === userId))
    );
    setPrivateMessages(filtered);
  }, [messages, userId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [privateMessages]);

  const handleSendMessage = (content) => {
    sendPrivateMessage(userId, content);
  };

  const handleTyping = () => {
    setTyping(true);
    // Automatically stop typing after 2 seconds of inactivity
    setTimeout(() => setTyping(false), 2000);
  };

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {(otherUser.name || otherUser.email || "U")[0].toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{otherUser.name || otherUser.email}</h2>
          <p className="text-sm text-gray-600">
            {otherUser.isTyping ? "typing..." : "online"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {privateMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === otherUser._id ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.senderId === otherUser._id
                  ? "bg-gray-200 text-gray-800"
                  : "bg-blue-600 text-white"
              }`}
            >
              {msg.messageType === "file" && msg.fileUrl ? (
                <div>
                  {msg.fileName?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={msg.fileUrl}
                      alt={msg.fileName}
                      className="max-w-full h-auto rounded mb-2"
                    />
                  ) : (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-300 hover:text-blue-100"
                    >
                      📎 {msg.fileName}
                    </a>
                  )}
                  {msg.content && <p>{msg.content}</p>}
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
              <div className={`text-xs mt-1 ${msg.senderId === otherUser._id ? "text-gray-500" : "text-blue-100"}`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        placeholder={`Message ${otherUser.name || otherUser.email}`}
      />
    </div>
  );
}
