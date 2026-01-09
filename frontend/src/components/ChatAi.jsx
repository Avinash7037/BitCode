import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 🔹 Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // 🔹 Typing animation effect
  const typeEffect = (fullText) => {
    let index = 0;
    let currentText = "";

    // Add empty assistant message first
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const interval = setInterval(() => {
      currentText += fullText[index];
      index++;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = currentText;
        return updated;
      });

      if (index >= fullText.length) {
        clearInterval(interval);
        setIsThinking(false);
      }
    }, 15); // typing speed (lower = faster)
  };

  const onSubmit = async (data) => {
    const text = data.message?.trim();
    if (!text || isThinking) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsThinking(true);
    reset();

    try {
      const { data: res } = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      typeEffect(res.message); // 👈 typing animation
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error from AI Chatbot. Please try again.",
        },
      ]);
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] min-h-[500px] border rounded-lg bg-base-100">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-bubble bg-base-100 text-base-content max-w-2xl prose prose-sm">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-300 animate-pulse">
              🤖 Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-base-100 border-t"
      >
        <div className="flex items-center gap-2">
          <input
            disabled={isThinking}
            placeholder="Ask about this problem (logic, hints, edge cases...)"
            className="input input-bordered flex-1"
            {...register("message", { required: true, minLength: 2 })}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!!errors.message || isThinking}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;
