"use client"; // Ensures client-side rendering
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // For animations
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function ChatPage() {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const chatContainerRef = useRef(null);

  // Apply dark mode to the <html> tag dynamically
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Scroll to the bottom when messages are updated
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!userMessage) return;

    const newMessage = { role: "user", content: userMessage };
    setChatHistory((prev) => [...prev, newMessage]);
    setUserMessage("");

    setIsTyping(true); // Show typing indicator

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/chat/?message=${encodeURIComponent(userMessage)}`
      );
      const data = await res.json();

      const botMessage = { role: "bot", content: data.response };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: "Error: Could not fetch response." },
      ]);
    } finally {
      setIsTyping(false); // Remove typing indicator
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center text-lg font-semibold dark:bg-gray-800 relative">
        💬 Chatbot Interface
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* Chat History */}
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: "75vh" }}
      >
        {chatHistory.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-xl max-w-xs shadow-md ${msg.role === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
          >
            <p>{msg.content}</p>
            <span className="block text-right text-xs text-gray-400 mt-1">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="mr-auto text-gray-400 italic animate-pulse">
            Bot is typing...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex p-4 bg-white border-t border-gray-300 dark:bg-gray-800">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 flex items-center transition"
        >
          <PaperAirplaneIcon className="h-5 w-5 mr-1" />
          Send
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-center p-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        Powered by Django & Next.js | Made with ❤️
      </footer>
    </div>
  );
}
