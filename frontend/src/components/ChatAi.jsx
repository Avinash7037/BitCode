import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    const text = data.message?.trim();
    if (!text) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    reset();

    try {
      const { data: res } = await axiosClient.post("/ai/chat", {
        messages: updatedMessages, // ✅ includes latest message
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.message },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error from AI Chatbot. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] min-h-[500px] border rounded-lg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-bubble bg-base-100 text-base-content max-w-xl">
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-base-100 border-t"
      >
        <div className="flex items-center gap-2">
          <input
            placeholder="Ask about this problem (logic, hints, edge cases...)"
            className="input input-bordered flex-1"
            {...register("message", { required: true, minLength: 2 })}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!!errors.message}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;
