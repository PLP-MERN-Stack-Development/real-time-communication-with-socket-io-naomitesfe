import { useState } from 'react';

export default function Login({ setUsername, connect }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setUsername(input.trim());
    connect(input.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '50px' }}>
      <input
        type="text"
        placeholder="Enter username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: '8px', width: '200px' }}
      />
      <button type="submit" style={{ padding: '8px 16px', marginLeft: '10px' }}>
        Join Chat
      </button>
    </form>
  );
}
