import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all chat users (admin panel)
export const fetchChatUsers = createAsyncThunk("chat/fetchChatUsers", async () => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/chat/users`);
  //console.log(response);
  
  return response.data.data;
});

// Fetch messages for a given roomId
export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (userId) => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/chat/user/${userId}`);
  return response.data.data;
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    chatUsers: [],
    activeRoomId: null,
    socket: null,
  },
  reducers: {
    setActiveRoom(state, action) {
      state.activeRoomId = action.payload;
    },
    setSocket(state, action) {
      state.socket = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(fetchChatUsers.fulfilled, (state, action) => {
        state.chatUsers = action.payload;
      });
  },
});

export const { setActiveRoom, setSocket, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
