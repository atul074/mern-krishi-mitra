import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";

const Store = configureStore({
  reducer: {
    auth: authReducer, 
    adminProducts: adminProductsSlice,

  },
});

export default Store;