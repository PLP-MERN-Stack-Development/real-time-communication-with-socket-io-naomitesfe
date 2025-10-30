import { useState } from 'react';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import { useSocket } from './socket/socket';

function App() {
  const [username, setUsername] = useState('');
  const socketData = useSocket();

  return (
    <div className="App">
      {!username ? (
        <Login setUsername={setUsername} connect={socketData.connect} />
      ) : (
        <ChatRoom username={username} socketData={socketData} />
      )}
    </div>
  );
}

export default App;
