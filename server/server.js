// server.js — Main backend for Socket.io chat app

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory stores
const users = {}; // { socketId: { username, id } }
const messages = []; // [{ message, sender, timestamp }]
const typingUsers = {}; // { socketId: username }
const onlineUsers = new Map(); // Track online users for notifications

// 🔹 Socket.io connection
io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    onlineUsers.set(socket.id, username);

    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    io.emit('onlineUsers', Array.from(onlineUsers.values()));

    console.log(`${username} joined the chat`);
  });

  // Handle joining a room
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    console.log(`${users[socket.id]?.username} joined room: ${roomName}`);
    socket.emit('system_message', {
      id: Date.now(),
      system: true,
      message: `You joined room: ${roomName}`,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle sending a public message
  socket.on('send_message', (messageData) => {
    const message = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message: messageData.message,
      timestamp: new Date().toISOString(),
    };

    messages.push(message);
    if (messages.length > 100) messages.shift();

    io.emit('receive_message', message);
  });

  // Handle private messaging
  socket.on('private_message', ({ to, message }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      receiverId: to,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };

    // Send to both sender and receiver
    socket.emit('private_message', messageData);
    socket.to(to).emit('private_message', messageData);
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    const username = users[socket.id]?.username;
    if (!username) return;

    if (isTyping) {
      typingUsers[socket.id] = username;
    } else {
      delete typingUsers[socket.id];
    }

    io.emit('typing_users', Object.values(typingUsers));
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users[socket.id]?.username;
    console.log(`🔴 ${username || 'Unknown user'} disconnected`);

    delete users[socket.id];
    delete typingUsers[socket.id];
    onlineUsers.delete(socket.id);

    io.emit('user_left', { username, id: socket.id });
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
    io.emit('onlineUsers', Array.from(onlineUsers.values()));
  });
});

// 🔹 REST API routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('✅ Socket.io Chat Server is running successfully!');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, server, io };
