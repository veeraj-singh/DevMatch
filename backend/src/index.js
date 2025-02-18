const express = require("express");
const { createServer } = require('http');
const { Server } = require('socket.io');
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const { MatchMessage , WorkspaceMessage } = require('./message_model') ;
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  }
});

app.get('/',(req,res)=>{
  res.json({message:"I am running"})
})

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join-room', ({ roomId }) => {
      socket.join(roomId);
      console.log(`User joined room ${roomId}`);
    });
  
    // Handle Sending and Broadcasting Messages
    socket.on('send-message', async ({ roomId, senderId, message }) => {
      try {
        let savedMessage = null;
        if (roomId.startsWith('workspace-')) {
          const workspaceId = roomId.split('-')[1];
          savedMessage = await WorkspaceMessage.create({
            workspaceId,
            senderId,
            message,
          });
        } else if (roomId.startsWith('match-')) {
          const matchId = roomId.split('-')[1];
          savedMessage = await MatchMessage.create({
            matchId,
            senderId,
            message,
          });
        }
  
        if (savedMessage) {
          io.to(roomId).emit('receive-message', savedMessage); // Broadcast to room
          console.log(`Message sent to room ${roomId}`);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const matchRoutes = require("./routes/matches");
const messageRoutes = require("./routes/messages")
const taskRoutes = require("./routes/tasks")

app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/messages", messageRoutes)
app.use("/api/tasks",taskRoutes)


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


