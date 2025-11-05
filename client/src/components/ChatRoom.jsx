import { useState, useEffect, useRef } from 'react';
import './ChatRoom.css';
import TypingIndicator from './TypingIndicator';

export default function ChatRoom({ username, socketData }) {
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socketData.sendMessage(message);
    setMessage('');
    socketData.setTyping(false);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socketData.setTyping(e.target.value.length > 0);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [socketData.messages]);

  return (
    <div className="chat-container">
      {/* Left panel: messages + input */}
      <div className="chat-left">
        <div className="chat-messages">
          {socketData.messages.map((msg) => (
            <p key={msg.id} className={msg.system ? 'system-msg' : 'user-msg'}>
              {msg.system ? msg.message : <strong>{msg.sender}:</strong>} {!msg.system && msg.message}
            </p>
          ))}
          <div ref={chatEndRef} />
        </div>

        {socketData.typingUsers.length > 0 && (
          <TypingIndicator typingUsers={socketData.typingUsers} />
        )}

        <form onSubmit={handleSend} className="chat-form">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
          />
          <button type="submit">Send</button>
        </form>
      </div>

      {/* Right panel: online users */}
      <div className="chat-users">
        <h4>Online Users</h4>
        <ul>
          {socketData.users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
