const { Server } = require("socket.io");

/**
 * roomId -> {
 *   leaderSocketId,
 *   users: Map(socketId -> userName)
 * }
 */
const rooms = {};

/**
 * socketId -> roomId
 */
const socketRoomMap = {};

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "https://bitcode-frontend.onrender.com",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    // ================= JOIN =================
    socket.on("join-room", ({ roomId, userName, isLeader }) => {
      if (socketRoomMap[socket.id]) return; // prevent duplicate joins

      socket.join(roomId);
      socketRoomMap[socket.id] = roomId;

      if (!rooms[roomId]) {
        rooms[roomId] = {
          leaderSocketId: socket.id,
          users: new Map(),
        };
      }

      if (isLeader) {
        rooms[roomId].leaderSocketId = socket.id;
      }

      rooms[roomId].users.set(socket.id, userName);

      io.to(roomId).emit(
        "room-users",
        Array.from(rooms[roomId].users.entries()).map(([socketId, name]) => ({
          socketId,
          name,
        }))
      );
    });

    // ================= LEAVE =================
    socket.on("leave-room", ({ roomId }) => {
      const room = rooms[roomId];
      if (!room) return;

      // 👑 Leader ends meeting
      if (room.leaderSocketId === socket.id) {
        io.to(roomId).emit("meeting-ended");
        delete rooms[roomId];
        delete socketRoomMap[socket.id];
        return;
      }

      // 👤 Normal user leaves
      room.users.delete(socket.id);
      delete socketRoomMap[socket.id]; // ✅ FIXED syntax error
      socket.leave(roomId);

      io.to(roomId).emit(
        "room-users",
        Array.from(room.users.entries()).map(([socketId, name]) => ({
          socketId,
          name,
        }))
      );
    });

    // ================= CODE =================
    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-update", code);
    });

    // ================= CHAT =================
    socket.on("send-message", ({ roomId, message, userName }) => {
      io.to(roomId).emit("receive-message", {
        userName,
        message,
        time: new Date().toLocaleTimeString(),
      });
    });

    // ================= CURSOR =================
    socket.on("cursor-change", ({ roomId, userName, position }) => {
      socket.to(roomId).emit("cursor-update", {
        userName,
        position,
      });
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      const roomId = socketRoomMap[socket.id];
      if (!roomId) return;

      const room = rooms[roomId];
      if (!room) {
        delete socketRoomMap[socket.id];
        return;
      }

      if (room.leaderSocketId === socket.id) {
        io.to(roomId).emit("meeting-ended");
        delete rooms[roomId];
      } else {
        room.users.delete(socket.id);

        io.to(roomId).emit(
          "room-users",
          Array.from(room.users.entries()).map(([socketId, name]) => ({
            socketId,
            name,
          }))
        );
      }

      delete socketRoomMap[socket.id];
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};

module.exports = { initSocket };
