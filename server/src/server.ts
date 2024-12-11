import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// const FRONTEND_URL = "http://localhost:5173";
const PORT = process.env.PORT || 3000;
// const PORT = 3000;

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(express.json());

// Add at the top of the file
const roomCreators = new Map<string, string>();

// Socket.IO connection handling
io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId: string, isCreator: boolean) => {
    socket.join(roomId);
    if (isCreator) {
      roomCreators.set(roomId, socket.id);
    }
    socket.to(roomId).emit("user-connected", socket.id);
  });

  socket.on("offer", (payload: any) => {
    io.to(payload.target).emit("offer", {
      sdp: payload.sdp,
      caller: socket.id,
    });
  });

  socket.on("answer", (payload: any) => {
    io.to(payload.target).emit("answer", {
      sdp: payload.sdp,
      answerer: socket.id,
    });
  });

  socket.on("ice-candidate", (payload: any) => {
    io.to(payload.target).emit("ice-candidate", {
      candidate: payload.candidate,
      from: socket.id,
    });
  });

  socket.on("end-call", (roomId: string) => {
    const creatorId = roomCreators.get(roomId);
    if (creatorId === socket.id) {
      io.to(roomId).emit("call-ended");
      roomCreators.delete(roomId);
    }
  });

  socket.on("leave-call", (roomId: string) => {
    socket.to(roomId).emit("user-left", socket.id);
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Clean up room creator if disconnected user was a creator
    for (const [roomId, creatorId] of roomCreators.entries()) {
      if (creatorId === socket.id) {
        roomCreators.delete(roomId);
        io.to(roomId).emit("call-ended");
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
