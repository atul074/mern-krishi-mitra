import UserCartItemsContent from "../../components/shopping/cart-items-content";
import { useNavigate } from "react-router-dom";
import { fetchCartItems} from "../../store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
function ShoppingCart() {
    const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  //const { productList } = useSelector((state) => state.shopProducts);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalCartAmount =
  cartItems && cartItems.items && cartItems.items.length > 0
    ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
            currentItem?.quantity,
        0
      )
    : 0;
    const originalAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum + currentItem?.price *
              currentItem?.quantity,
          0
        )
      : 0;
  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);
    return (

        <section class=" py-8 antialiased bg-[#2eaf7d]  md:py-16">
  <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <h2 class="text-xl font-bold text-white sm:text-2xl">Shopping Cart</h2>

    <div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
      <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
        <div class="space-y-6">
        {cartItems&& cartItems.items && cartItems.items.length > 0
          ? cartItems.items.map((item) => <UserCartItemsContent cartItem={item} />)
          : null}
         
          
          
        </div>
        
      </div>

      <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
        <div class="space-y-4 rounded-xl border border-gray-600 bg-gray-300 p-4 shadow-xl  sm:p-6">
          <p class="text-xl font-semibold text-gray-900">Order summary</p>

          <div class="space-y-4">
            <div class="space-y-2">
              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-black ">Original price</dt>
                <dd class="text-base font-medium text-gray-900 ">${originalAmount}</dd>
              </dl>

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-black">Savings</dt>
                <dd class="text-base font-medium text-green-600">-${originalAmount-totalCartAmount}</dd>
              </dl>

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-black">Product Delivery</dt>
                <dd class="text-base font-medium text-gray-900 ">$0</dd>
              </dl>

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-black">Tax</dt>
                <dd class="text-base font-medium text-gray-900 ">$0</dd>
              </dl>
            </div>

            <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt class="text-base font-bold text-black">Total</dt>
              <dd class="text-base font-bold text-red-600">${totalCartAmount}</dd>
            </dl>
          </div>

          <button onClick={() => { navigate("/shop/checkout")}} class="flex  items-center justify-center  bg-primary-700 px-5 py-2.5 text-sm  hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-[#02353c] hover:bg-white hover:text-[#02353c] w-full text-white  rounded-lg font-bold">Proceed to Checkout</button>

          <div class="flex items-center justify-center gap-2">
            <span class="text-sm font-normal text-gray-900 "> or </span>
            <button onClick={() => { navigate("/shop/listing")}} class="inline-flex items-center gap-2 text-sm text-primary-700 underline hover:no-underline dark:text-primary-500 text-black font-bold">
              Continue Shopping
              <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </button>
          </div>
        </div>

        
      </div>
    </div>
  </div>
</section>
    );
  }
  
  export default ShoppingCart;