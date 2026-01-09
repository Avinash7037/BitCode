const { Server } = require("socket.io");

let io;
const usersInRoom = {}; // roomId -> [{ socketId, name }]

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join-room", ({ roomId, user }) => {
      socket.join(roomId);

      if (!usersInRoom[roomId]) usersInRoom[roomId] = [];

      usersInRoom[roomId].push({
        socketId: socket.id,
        name: user,
      });

      io.to(roomId).emit("room-users", usersInRoom[roomId]);
    });

    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-update", code);
    });

    socket.on("send-message", ({ roomId, message, user }) => {
      io.to(roomId).emit("receive-message", {
        user,
        message,
        time: new Date().toLocaleTimeString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);

      for (const roomId in usersInRoom) {
        usersInRoom[roomId] = usersInRoom[roomId].filter(
          (u) => u.socketId !== socket.id
        );
        io.to(roomId).emit("room-users", usersInRoom[roomId]);
      }
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
