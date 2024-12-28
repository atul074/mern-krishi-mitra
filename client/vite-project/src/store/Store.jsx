import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";

import shopProductsSlice from "./shop/products-slice";
const Store = configureStore({
  reducer: {
    auth: authReducer, 
    adminProducts: adminProductsSlice,

    shopProducts: shopProductsSlice,
  },
});

export default Store;