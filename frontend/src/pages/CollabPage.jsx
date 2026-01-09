import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import { getSocket } from "../utils/socket";

function CollabPage() {
  const { roomId } = useParams();

  const socketRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const [code, setCode] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const userName =
    localStorage.getItem("username") ||
    `User-${Math.floor(Math.random() * 1000)}`;

  // ✅ SOCKET SETUP (ROOM-BASED, NOT CONNECTION-BASED)
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    // join room
    socket.emit("join-room", { roomId, userName });

    // listeners
    socket.on("room-users", setUsers);

    socket.on("code-update", (newCode) => {
      isRemoteUpdate.current = true;
      setCode(newCode);
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      // leave ONLY the room (not socket)
      socket.emit("leave-room", { roomId });

      socket.off("room-users");
      socket.off("code-update");
      socket.off("receive-message");
    };
  }, [roomId]); // ❗ DO NOT add userName here

  const handleCodeChange = (value) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    setCode(value);
    socketRef.current.emit("code-change", {
      roomId,
      code: value,
    });
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    socketRef.current.emit("send-message", {
      roomId,
      message: chatInput,
      userName,
    });

    setChatInput("");
  };

  return (
    <div className="h-screen flex bg-base-200">
      {/* CODE EDITOR */}
      <div className="w-3/4 p-2">
        <Editor
          height="100%"
          language="javascript"
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{ minimap: { enabled: false } }}
        />
      </div>

      {/* SIDEBAR */}
      <div className="w-1/4 bg-base-100 p-4 flex flex-col border-l">
        <h2 className="font-bold text-lg mb-2">
          👥 Collaborators ({users.length})
        </h2>

        <ul className="mb-4 space-y-1 text-sm">
          {users.map((u) => (
            <li key={u.socketId} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              {u.name}
            </li>
          ))}
        </ul>

        <h2 className="font-bold text-lg mb-2">💬 Chat</h2>

        <div className="flex-1 overflow-y-auto border p-2 mb-2 rounded bg-base-200">
          {messages.map((m, i) => (
            <div key={i} className="text-sm mb-2">
              <div className="font-semibold">{m.userName}</div>
              <div>{m.message}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="input input-bordered flex-1"
            placeholder="Message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollabPage;
