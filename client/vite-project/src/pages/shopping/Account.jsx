import accImg from "../../assets/react.svg";

import Address from "../../components/shopping/address";
import ShoppingOrders from "../../components/shopping/orders";


function ShoppingAccount() {
  


  

  return (
    <div className="flex flex-col">
      {/* Account Image */}
      {/* <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Account Background"
        />
      </div> */}
      {/* Content Section */}
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm">
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              id="tab-orders"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 active:text-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => toggleTab('orders')}
            >
              Orders
            </button>
            <button
              id="tab-address"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 active:text-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => toggleTab('address')}
            >
              Address
            </button>
          </div>
          {/* Tabs Content */}
          <div className="mt-4">
            <div id="content-orders" className="hidden">
              {/* Replace with ShoppingOrders Component Content */}
              <ShoppingOrders/>
              <p>Order details ...</p>
            </div>
            <div id="content-address" className="hidden">
              {/* Replace with Address Component Content */}
              <Address/>
              <p>Address details...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function toggleTab(tab) {
    const ordersTab = document.getElementById('content-orders');
    const addressTab = document.getElementById('content-address');

    if (tab === 'orders') {
      ordersTab.classList.remove('hidden');
      addressTab.classList.add('hidden');
    } else {
      ordersTab.classList.add('hidden');
      addressTab.classList.remove('hidden');
    }
  }
}

export default ShoppingAccount;
