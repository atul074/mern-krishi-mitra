import { configureStore } from "@reduxjs/toolkit";
import authSlice from './auth-slice'
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import adminUsersSlice from "./admin/users-slice"

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import chatSlice from "./chat_slice"; // Adjust the path as needed

const Store = configureStore({
  reducer: {
    auth: authSlice, 
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminUsers:adminUsersSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    chat: chatSlice,
  },

  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredPaths: ["chat.socket"], // ⛔ ignore warning ONLY IF you're absolutely forced to keep socket here
  //     },
  //   }),
});

export default Store;