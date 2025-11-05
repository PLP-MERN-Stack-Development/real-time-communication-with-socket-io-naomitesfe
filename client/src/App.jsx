import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import Login from "./components/Login";
import ChatApp from "./components/ChatApp";
import { useSocket } from "./socket/socket";

export default function App() {
  const [username, setUsername] = useState("");
  const socketData = useSocket();

  // Connect when username is set
  useEffect(() => {
    if (username) {
      socketData.connect(username);
    }
    return () => socketData.disconnect();
  }, [username]);

  const handleLogin = (name) => {
    setUsername(name);
    toast.success(`Welcome, ${name}!`);
  };

  const handleLogout = () => {
    socketData.disconnect();
    setUsername("");
    toast("Logged out successfully");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!username ? (
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-primary mb-4">Chat App</h1>
              <p className="text-xl text-secondary">
                Enter a username to start chatting
              </p>
            </div>
            <Login setUsername={handleLogin} />
          </div>
        </main>
      ) : (
        <ChatApp username={username} socketData={socketData} onLogout={handleLogout} />
      )}
      <Toaster />
    </div>
  );
}
