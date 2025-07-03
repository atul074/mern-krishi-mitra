import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminLayout from './components/admin/Layout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminFeatures from './pages/admin/Features'
import ShoppingLayout from './components/shopping/Layout'
import NotFound from './pages/notfound/Index'
import UnauthPage from './pages/unauth/Index'
import ShoppingHome from './pages/shopping/Home'
import ShoppingListing from './pages/shopping/Listing'
import ShoppingCheckout from './pages/shopping/Checkout'
import ShoppingAccount from './pages/shopping/Account'
import ShoppingCart from './pages/shopping/Cart'
import CheckAuth from './components/common/Check-auth'
import PaymentSuccessPage from './pages/shopping/payment-success'
import PaypalReturnPage from './pages/shopping/paypal-return'
import SearchProducts from './pages/shopping/search'
import SuggestionProducts from './pages/shopping/Suggestion'
import UserChat from './pages/shopping/UserChat'
import AdminChatPanel from './pages/admin/AdminChat'

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";

function App() {
const { user, isAuthenticated, isLoading } = useSelector(
  (state) => state.auth
);
const dispatch = useDispatch();

useEffect(() => {
  dispatch(checkAuth());
}, [dispatch]);

if (isLoading) return(<div className='text-3xl text-center mt-40'> Loading....</div> );
  return (
    <>
     <Routes>
     <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
      <Route
      path="/auth"
          element={
             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
             </CheckAuth>
          } 
        >
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />
      </Route>
      <Route
          path="/admin"
          element={
             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout/>
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard/>} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders/>} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="chat" element={<AdminChatPanel />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome/>} />
          <Route path="listing" element={<ShoppingListing/>} />
          <Route path="checkout" element={<ShoppingCheckout/>} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="cart" element={<ShoppingCart/>} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="suggestion" element={<SuggestionProducts />} />
          <Route path="chat" element={<UserChat/>} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage/>} />
        <Route path="*" element={<NotFound/>} />
     </Routes>
    </>
  )
}

export default App
