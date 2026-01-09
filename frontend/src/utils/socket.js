import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket"], // ⬅ prevents polling reconnect loop
    });
  }
  return socket;
};
