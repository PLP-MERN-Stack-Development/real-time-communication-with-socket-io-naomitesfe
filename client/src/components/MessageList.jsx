export default function MessageList({ messages }) {
  return (
    <div className="messages">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.system ? 'system' : ''}`}>
          {msg.system ? (
            <em>{msg.message}</em>
          ) : (
            <>
              <strong>{msg.sender}</strong>: {msg.message}
              <span className="timestamp">
                {' '}{new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
