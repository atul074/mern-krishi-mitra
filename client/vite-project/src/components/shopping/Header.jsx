




import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/auth-slice";
import { fetchCartItems } from "../../store/shop/cart-slice";
import UserChat from "../../pages/shopping/UserChat"; 

function ShoppingHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [showChat, setShowChat] = useState(false);
  const chatRef = useRef(null);
  const location = useLocation();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    // Close chat when route changes
    setShowChat(false);
  }, [location]);

  useEffect(() => {
    // Close chat when clicking outside
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setShowChat(false);
      }
    };
    
    if (showChat) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showChat]);

  useEffect(() => {
    // Prevent background scrolling when chat is open
    if (showChat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showChat]);


  return (
    <>
      {/* Header with conditional backdrop blur */}
      <div className="">
        <header className="fixed  left-0 right-0 top-0 z-40 w-full border-b bg-gradient-to-r from-[#2eaf7d] from-10% via-[#65CCB8] via-40% to-[#2eaf7d] to-90%">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <Link to="/shop/home" className="flex items-center gap-2">
              <img 
                src="https://svgsilh.com/svg/576549.svg" 
                className="w-12 h-10"
                alt="Krishi Mitra Logo"
              />
              <span className="font-bold text-white text-2xl">Krishi Mitra</span>
            </Link>

            <ul className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <li>
              <Link to={"/shop/search"} className="flex">
                 <svg class="w-10 h-10  text-black " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                 </svg>


               </Link>
             </li>

             <li>
               <Link to="/shop/suggestion" className="flex items-center">
                 <svg
                  className="h-10 lg:h-10 p-1 ml-2 text-black "
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="lightbulb"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 352 512"
                >
                  <path
                    fill="currentColor"
                    d="M176 0C79.3 0 0 79.3 0 176c0 44.2 16.9 84.4 44.4 114.6 17.7 19.4 28.5 43.8 31.2 69.4 .3 3.1 2.9 5.5 6 5.5h188.7c3.1 0 5.7-2.4 6-5.5 2.7-25.6 13.5-50 31.2-69.4C335.1 260.4 352 220.2 352 176 352 79.3 272.7 0 176 0zm24 448h-48c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z"
                  ></path>
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

              {/* Chat Icon (Button to open modal) */}
              <li>
                <button 
                  onClick={() => setShowChat(true)} 
                  className="flex p-1"
                >
                  <svg
                  className="h-9 lg:h-11 p-2 text-black"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="comments"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M256 32C114.6 32 0 125.1 0 240c0 49.6 24.6 95.1 65.5 130.2C57.4 417.3 10.3 457.2 10.1 457.4a8 8 0 00-.9 11.3A8.2 8.2 0 0016 472c66.5 0 116.2-31.1 139.3-49.6a340.6 340.6 0 00100.7 15.6c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368a304.8 304.8 0 01-94.7-14.7l-25.6-7.6-20.7 15.5a205.9 205.9 0 01-38.3 21.1c8.8-17.3 15.1-36.7 16.8-56.6l2.1-24.3-18.6-18.2C52.3 282.2 32 252.4 32 240c0-88.2 100.3-160 224-160s224 71.8 224 160-100.3 160-224 160z"
                  ></path>
                </svg>
                </button>
              </li>

             <li>
               <button onClick={handleLogout} >
                 <svg class="h-9 lg:h-10 p-2 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                   <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3" />
                 </svg>
               </button>
             </li>
            </ul>
          </div>
        </header>
      </div>

      {/* Chat Modal Overlay */}
      {showChat && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div 
            ref={chatRef} 
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl h-[85vh] relative overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowChat(false)}
                className="text-red-500 hover:text-red-700 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 min-h-0">
  <UserChat />
</div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShoppingHeader;