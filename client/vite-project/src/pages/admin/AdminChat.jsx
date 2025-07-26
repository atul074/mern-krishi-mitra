import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatUsers,
  fetchMessages,
  setActiveRoom,
  addMessage,
} from "../../store/chat_slice";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import chat from "../../assets/chat.jpg";

const socket = io(import.meta.env.VITE_BASE_URL);

function AdminChatPanel() {
  const dispatch = useDispatch();
  const { chatUsers, messages, activeRoomId } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChatUsers());

    socket.on("receiveMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = (roomId) => {
    dispatch(setActiveRoom(roomId));
    dispatch(fetchMessages(roomId));
    socket.emit("joinRoom", { roomId });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const messageData = {
      roomId: activeRoomId,
      senderId: user.id,
      message: input,
      role: user.role,
    };

    socket.emit("sendMessage", messageData);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden"> {/* Adjust 64px to match your header height */}
      {/* Sidebar */}
      <div className="w-1/5 flex flex-col bg-white border-r border-gray-200 shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-400 to-[#2eaf7d] p-2 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold ml-3 text-transparent bg-clip-text bg-gradient-to-r from-[#02353c] to-[#2eaf7d]">Chat Users</h2>
          </div>
        </div>
        
        {/* Scrollable User List */}
        <div className="overflow-y-auto flex-1 p-4">
          {chatUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => openChat(u.id)}
              className={`cursor-pointer mb-3 p-3 rounded-lg transition-all duration-300 flex items-center ${
                activeRoomId === u.id
                  ? "bg-gradient-to-r from-green-100 to-[#2eaf7d] border-l-4 border-green-500 shadow-inner"
                  : "hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#02353c] to-[#2eaf7d] flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                {u.userName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-950">{u.userName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Background Image with Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-md opacity-50 z-0"
          style={{ backgroundImage: `url(${chat})` }}
        ></div>
        
        
        
        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 relative z-10">
          <div className="bg-whit bg-opacity-90 rounded-xl shadow-inner p-4 min-h-full">
            {messages.length > 0 ? (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-4 flex ${
                    msg.role === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-xs">
                    <div
                      className={`px-4 py-2 rounded-lg shadow-md backdrop-blur-sm ${
                        msg.role === "admin"
                          ? "bg-gradient-to-r from-green-200 to-[#038a54] text-right"
                          : "bg-gray-100"
                      }`}
                    >
                      <div>{msg.message}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
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
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-full inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#2eaf7d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-lg">No messages yet</p>
                  <p className="text-sm">Start a conversation!</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Fixed Input Area */}
        <div className="relative z-20 bg-white bg-opacity-90 border-t border-gray-200 p-4">
          <div className="flex rounded-lg overflow-hidden shadow-lg">
            <input
              className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="group relative px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#02353c] to-[#2eaf7d] overflow-hidden transition-all duration-300 hover:from-white hover:to-white hover:text-[#02353c] focus:outline-none focus:ring-2 focus:ring-black"
            >
              <span className="relative z-10 transition-all duration-300 group-hover:-translate-x-2">
                Send
              </span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-6 transition-all duration-300">
                →
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminChatPanel;