import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";


const Store = configureStore({
  reducer: {
    auth: authReducer, 

  },
});

export default Store;