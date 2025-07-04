import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchMessages } from "../../store/chat_slice";
import socket from "../../Socket";
import chatBg from "../../assets/chat.jpg";

function UserChat() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    socket.emit("joinRoom", { roomId: user.id });
    dispatch(fetchMessages(user.id));

    socket.on("receiveMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [dispatch, user.id]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const message = {
      roomId: user.id,
      senderId: user.id,
      message: input,
      role: user.role,
    };
    socket.emit("sendMessage", message);
    setInput("");
  };

  return (
    <div
      className="flex flex-col h-full bg-cover bg-center relative rounded-xl overflow-hidden"
      style={{ backgroundImage: `url(${chatBg})` }}
    >
      {/* Fixed header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b shadow-sm py-3 px-4 flex items-center gap-3">
        <svg 
          className="w-6 h-6 text-green-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        <h2 className="font-semibold text-gray-700">Chat with Admin</h2>
      </div>

      {/* Chat messages area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-white/70 backdrop-blur-sm scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              msg.senderId === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-5 py-3 rounded-2xl shadow-md transition-all duration-200 max-w-[80%] text-sm sm:text-base ${
                msg.senderId === user.id
                  ? "bg-green-300 hover:bg-green-400"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <div>{msg.message}</div>
              <div className="text-xs text-gray-600 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Fixed input box */}
      <div className="sticky bottom-0 bg-white/90 px-3 py-3 flex items-center gap-2 backdrop-blur-lg border-t shadow-lg">
        <input
          className="flex-1 px-4 py-2 rounded-l-full border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-r-full shadow-md transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default UserChat;