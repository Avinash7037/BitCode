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
  const editorRef = useRef(null);
  const joinedRef = useRef(false);
  const isRemote = useRef(false);

  const [code, setCode] = useState("");
  const [language] = useState("javascript");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [cursors, setCursors] = useState({});

  const userName =
    localStorage.getItem("username") ||
    `User-${Math.floor(Math.random() * 1000)}`;

  // ================= SOCKET SETUP =================
  useEffect(() => {
    const s = getSocket();
    socket.current = s;

    // 🔒 join only once
    if (!joinedRef.current) {
      joinedRef.current = true;
      s.emit("join-room", {
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

    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);

    const handleCursor = ({ userName, position }) => {
      setCursors((prev) => ({ ...prev, [userName]: position }));
    };

    const handleMeetingEnded = () => {
      if (isLeader && problemId) {
        navigate(`/problem/${problemId}`);
      } else {
        navigate("/signup");
      }
    };

    s.on("room-users", handleUsers);
    s.on("code-update", handleCodeUpdate);
    s.on("receive-message", handleMessage);
    s.on("cursor-update", handleCursor);
    s.on("meeting-ended", handleMeetingEnded);

    return () => {
      s.off("room-users", handleUsers);
      s.off("code-update", handleCodeUpdate);
      s.off("receive-message", handleMessage);
      s.off("cursor-update", handleCursor);
      s.off("meeting-ended", handleMeetingEnded);
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

  // ================= CURSOR SEND =================
  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e) => {
      socket.current.emit("cursor-change", {
        roomId,
        userName,
        position: e.position,
      });
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

  // ================= INVITE =================
  const inviteUser = () => {
    const link = `${window.location.origin}/collab/${roomId}?problemId=${problemId}&leader=false`;
    navigator.clipboard.writeText(link);
    alert("Invite link copied!");
  };

  // ================= LEAVE =================
  const leaveRoom = () => {
    socket.current.emit("leave-room", { roomId });

    // non-leader leaves → go to signup
    if (!isLeader) {
      setTimeout(() => navigate("/signup"), 100);
    }
    // leader → handled by meeting-ended
  };

  return (
    <div className="h-screen flex bg-base-200">
      {/* Editor */}
      <div className="w-3/4 p-2">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{ minimap: { enabled: false } }}
        />
      </div>

      {/* Sidebar */}
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
        <ul className="mb-3 text-sm">
          {users.map((u) => (
            <li key={u.socketId}>• {u.name}</li>
          ))}
        </ul>

        <div className="flex-1 overflow-y-auto border p-2 mb-2">
          {messages.map((m, i) => (
            <div key={i}>
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
