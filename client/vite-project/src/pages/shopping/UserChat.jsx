import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { addMessage, fetchMessages, setSocket } from "../../store/chat_slice";
import socket from "../../Socket";
//const socket = io("http://localhost:8000");

function UserChat() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", { roomId: user.id });
    //dispatch(setSocket(socket));
    dispatch(fetchMessages(user.id));
    console.log("Joining room with ID:", user.id);

    socket.on("receiveMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [user.id]);

  const handleSend = () => {
    const message = {
      roomId: user.id,
      senderId: user.id,
      message: input,
      role: user.role,
    };
    console.log(message);
    
    socket.emit("sendMessage", message);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto border rounded p-2">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.senderId === user.id ? "text-right" : "text-left"}`}>
            <div className="inline-block px-4 py-2 rounded-lg bg-green-100">{msg.message}</div>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          className="flex-1 border rounded-l px-4 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="bg-green-600 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}

export default UserChat;
