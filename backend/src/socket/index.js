const { Server } = require("socket.io");

const usersInRoom = {};

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join-room", ({ roomId, userName }) => {
      socket.join(roomId);

      if (!usersInRoom[roomId]) usersInRoom[roomId] = [];

      // ✅ prevent duplicates
      if (!usersInRoom[roomId].some((u) => u.socketId === socket.id)) {
        usersInRoom[roomId].push({
          socketId: socket.id,
          name: userName,
        });
      }

      io.to(roomId).emit("room-users", usersInRoom[roomId]);
    });

    socket.on("leave-room", ({ roomId }) => {
      if (!usersInRoom[roomId]) return;

      usersInRoom[roomId] = usersInRoom[roomId].filter(
        (u) => u.socketId !== socket.id
      );

      if (usersInRoom[roomId].length === 0) {
        delete usersInRoom[roomId];
      } else {
        io.to(roomId).emit("room-users", usersInRoom[roomId]);
      }
    });

    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-update", code);
    });

    socket.on("send-message", ({ roomId, message, userName }) => {
      io.to(roomId).emit("receive-message", {
        userName,
        message,
        time: new Date().toLocaleTimeString(),
      });
    });

    socket.on("disconnect", () => {
      for (const roomId in usersInRoom) {
        usersInRoom[roomId] = usersInRoom[roomId].filter(
          (u) => u.socketId !== socket.id
        );
        io.to(roomId).emit("room-users", usersInRoom[roomId]);
      }
    });
  });
};

module.exports = { initSocket };
