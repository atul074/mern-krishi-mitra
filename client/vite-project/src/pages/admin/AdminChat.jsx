import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatUsers,
  fetchMessages,
  setActiveRoom,
  addMessage,
} from "../../store/chat_slice";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

function AdminChatPanel() {
  const dispatch = useDispatch();
  const { chatUsers, messages, activeRoomId } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [input, setInput] = useState("");
 //console.log(user);
 console.log(chatUsers);
 
 
  useEffect(() => {
    dispatch(fetchChatUsers());

    socket.on("receiveMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

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
    setInput(""); // Clear input after sending
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - List of Users */}
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Chat Users</h2>
        {chatUsers.map((u) => (
          <div
            key={u}
            onClick={() => openChat(u.id)}
            className={`cursor-pointer mb-2 p-2 rounded hover:bg-gray-100 ${
              activeRoomId === u ? "bg-green-100 font-semibold" : ""
            }`}
          >
            {u.userName}
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto border rounded p-4 bg-white">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${
                msg.role === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.role === "admin" ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex mt-4">
          <input
            className="flex-1 border rounded-l px-4 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="bg-green-600 text-white px-6 py-2 rounded-r"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminChatPanel;
