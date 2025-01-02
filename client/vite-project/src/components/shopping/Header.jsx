import {
    Link,
    
   
  } from "react-router-dom";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/auth-slice";
import { fetchCartItems } from "../../store/shop/cart-slice";

function ShoppingHeader() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    function handleLogout() {
      dispatch(logoutUser());
    }
    useEffect(() => {
      dispatch(fetchCartItems(user?.id));
    }, [dispatch]);
    return(
        <header className="sticky top-0 z-40 w-full border-b bg-gradient-to-r from-[#2eaf7d] from-10% via-[#65CCB8] via-40% to-[#2eaf7d]  to-90% ... ">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/shop/home" className="flex items-center gap-2">
            {/* <HousePlug className="h-6 w-6" /> */}
            <img src="https://svgsilh.com/svg/576549.svg"  className="w-12 h-10 "/>
            <span className="font-bold text-white text-2xl">Krishi Mitra</span>
          </Link>
  
          <div className="">
            <ul className="text-black   cursor-pointer transition-all duration-400 relative group font-semibold text-base px-3 flex md:gap-2 lg:gap-2 sm: gap-2">
                <li>
                    <Link to={"/shop/search"} className="flex">
                    <svg class="w-10 h-10  text-black " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
</svg>


                    </Link>
                </li>
                <li>
                    <Link to={"/shop/cart"} className="flex">
                     <svg class="h-9 lg:h-10 p-1 ml-1 text-black" aria-hidden="true" focusable="false" data-prefix="far" data-icon="shopping-cart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" ><path fill="currentColor" d="M551.991 64H144.28l-8.726-44.608C133.35 8.128 123.478 0 112 0H12C5.373 0 0 5.373 0 12v24c0 6.627 5.373 12 12 12h80.24l69.594 355.701C150.796 415.201 144 430.802 144 448c0 35.346 28.654 64 64 64s64-28.654 64-64a63.681 63.681 0 0 0-8.583-32h145.167a63.681 63.681 0 0 0-8.583 32c0 35.346 28.654 64 64 64 35.346 0 64-28.654 64-64 0-18.136-7.556-34.496-19.676-46.142l1.035-4.757c3.254-14.96-8.142-29.101-23.452-29.101H203.76l-9.39-48h312.405c11.29 0 21.054-7.869 23.452-18.902l45.216-208C578.695 78.139 567.299 64 551.991 64zM208 472c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm256 0c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm23.438-200H184.98l-31.31-160h368.548l-34.78 160z"></path></svg>
                     <div class=" -top-1 left-0 z-10 bg-yellow-40 text-xs font-bold px- py-0.5 rounded-sm text-white"> {cartItems?.items?.length || 0}</div>
                    
                    </Link>
                </li>
                <li>
                <Link to={"/shop/account"}>
                      <svg class="h-9 lg:h-11 p-2 text-black " aria-hidden="true" focusable="false" data-prefix="far" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" ><path fill="currentColor" d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"></path></svg>
        
                    </Link>
                </li>
                <li>
                <button onClick={handleLogout} >
                  <svg class="h-9 lg:h-10 p-2 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"/>
                  </svg>
                </button>
                </li>
            </ul>
            
          </div>
        </div>
      </header>
    );
}
export default ShoppingHeader;
