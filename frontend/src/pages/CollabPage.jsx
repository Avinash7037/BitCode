import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import Editor from "@monaco-editor/react";
import { getSocket } from "../utils/socket";

function CollabPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();

  const problemId = searchParams.get("problemId");
  const isLeader = searchParams.get("leader") === "true";

  const navigate = useNavigate();

  const socket = useRef(null);
  const joinedRef = useRef(false);
  const isRemote = useRef(false);

  const [code, setCode] = useState("");
  const [language] = useState("javascript");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const userName =
    localStorage.getItem("username") ||
    `User-${Math.floor(Math.random() * 1000)}`;

  // ================= SOCKET SETUP =================
  useEffect(() => {
    socket.current = getSocket();

    // 🔒 Join only once per mount
    if (!joinedRef.current) {
      joinedRef.current = true;
      socket.current.emit("join-room", {
        roomId,
        userName,
        isLeader,
      });
    }

    const handleUsers = (users) => setUsers(users);

    const handleCodeUpdate = (newCode) => {
      isRemote.current = true;
      setCode(newCode);
    };

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleMeetingEnded = () => {
      // 👑 Leader → problem page
      if (isLeader && problemId) {
        navigate(`/problem/${problemId}`);
      } else {
        // 👤 Others → signup
        navigate("/signup");
      }
    };

    socket.current.on("room-users", handleUsers);
    socket.current.on("code-update", handleCodeUpdate);
    socket.current.on("receive-message", handleMessage);
    socket.current.on("meeting-ended", handleMeetingEnded);

    return () => {
      socket.current.off("room-users", handleUsers);
      socket.current.off("code-update", handleCodeUpdate);
      socket.current.off("receive-message", handleMessage);
      socket.current.off("meeting-ended", handleMeetingEnded);
      joinedRef.current = false;
    };
  }, [roomId, isLeader, problemId, navigate, userName]);

  // ================= CODE CHANGE =================
  const handleCodeChange = (value) => {
    if (isRemote.current) {
      isRemote.current = false;
      return;
    }
    setCode(value || "");
    socket.current.emit("code-change", {
      roomId,
      code: value,
    });
  };

  // ================= CHAT =================
  const sendMessage = () => {
    if (!chatInput.trim()) return;

    socket.current.emit("send-message", {
      roomId,
      userName,
      message: chatInput,
    });

    setChatInput("");
  };

  // ================= INVITE (LEADER ONLY) =================
  const inviteUser = () => {
    const inviteLink = `${window.location.origin}/collab/${roomId}?problemId=${problemId}&leader=false`;
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  // ================= LEAVE =================
  const leaveRoom = () => {
    socket.current.emit("leave-room", { roomId });

    // 👤 Non-leader: allow backend to broadcast first
    if (!isLeader) {
      setTimeout(() => {
        navigate("/signup");
      }, 100); // ⏱ tiny delay = reliable update
    }
    // 👑 Leader navigation handled by "meeting-ended"
  };

  return (
    <div className="h-screen flex bg-base-200">
      {/* ================= EDITOR ================= */}
      <div className="w-3/4 p-2">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{ minimap: { enabled: false } }}
        />
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="w-1/4 bg-base-100 p-4 flex flex-col border-l">
        <div className="flex justify-between mb-3">
          {isLeader && (
            <button className="btn btn-sm btn-outline" onClick={inviteUser}>
              Invite
            </button>
          )}

          <button className="btn btn-sm btn-error" onClick={leaveRoom}>
            Leave
          </button>
        </div>

        <h2 className="font-bold mb-1">👥 Collaborators ({users.length})</h2>
        <ul className="mb-3 text-sm space-y-1">
          {users.map((u) => (
            <li key={u.socketId}>• {u.name}</li>
          ))}
        </ul>

        <h2 className="font-bold mb-1">💬 Chat</h2>
        <div className="flex-1 overflow-y-auto border p-2 rounded mb-2">
          {messages.map((m, i) => (
            <div key={i} className="text-sm">
              <strong>{m.userName}</strong>: {m.message}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="input input-bordered flex-1"
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
