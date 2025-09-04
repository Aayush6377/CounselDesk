import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaUser, FaRobot } from "react-icons/fa";
import { generateContent } from "../../../services/geminiService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation } from '@tanstack/react-query';
import { useStore } from "../../../hooks/useStore";

const Chatbot = () => {
  const { messages, setMessages } = useStore();
  const [input, setInput] = useState("");
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const { mutate, isPending } = useMutation({
    mutationFn: generateContent,
    onSuccess: (aiResponseText) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "AI", text: aiResponseText },
      ]);
    },
    onError: (error) => {
      console.error(error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "AI",
          text: "Sorry, I am unable to provide a response at this time. Please try again later.",
        },
      ]);
    },
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newMessage = { sender: "User", text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    mutate(newMessage.text);
  };

  const getSenderIcon = (sender) => {
    if (sender === "AI") {
      return (
        <div className="flex-shrink-0 size-10 rounded-full bg-amber-900 flex items-center justify-center text-[var(--accent-color)]">
          <FaRobot />
        </div>
      );
    }
    return (
      <div className="flex-shrink-0 size-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
        <FaUser />
      </div>
    );
  };

  return (
    <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8 bg-[var(--secondary-color)]">
      <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1 animate-fadeIn bg-[#2D2D2D] rounded-2xl shadow-2xl border border-[#3E3E3E] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#3E3E3E] bg-[#2D2D2D]">
          <h1 className="text-white text-2xl font-bold">Legal AI Assistant</h1>
          <p className="text-gray-400 text-sm mt-1">Ask me anything about your legal concerns. I'm here to help.</p>
        </div>

        {/* Chat Messages */}
        <div ref={chatMessagesRef} className="flex-grow p-6 space-y-6 overflow-y-auto h-[60vh]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 chat-message ${
                message.sender === "User" ? "justify-end" : ""
              }`}
            >
              {message.sender === "AI" && getSenderIcon("AI")}
              <div
                className={`flex flex-col gap-2 ${
                  message.sender === "User" ? "items-end" : ""
                }`}
              >
                <div
                  className={`${
                    message.sender === "AI"
                      ? "bg-[#3E3E3E] text-white rounded-lg rounded-tl-none"
                      : "bg-[var(--primary-color)] text-white rounded-lg rounded-br-none"
                  } p-4 max-w-lg text-sm leading-relaxed break-words markdown-content`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
              {message.sender === "User" && getSenderIcon("User")}
            </div>
          ))}
          {isPending && (
            <div className="flex items-start gap-4 chat-message">
              {getSenderIcon("AI")}
              <div className="bg-[#3E3E3E] p-4 rounded-lg rounded-tl-none max-w-lg animate-pulse">
                <p className="text-white text-sm">Typing...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-[#3E3E3E] bg-[#2D2D2D]">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#3E3E3E] border border-[#555] rounded-full py-3 px-6 pr-16 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all duration-300"
              placeholder="Type your message here..."
              disabled={isPending}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center size-10 rounded-full bg-[var(--primary-color)] text-white hover:bg-amber-600 transition-all duration-300 transform hover:scale-110"
              disabled={isPending}
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Chatbot;
