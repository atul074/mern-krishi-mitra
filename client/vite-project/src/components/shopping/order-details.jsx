import { useSelector } from "react-redux";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-lg mx-auto max-h">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="font-medium">Order ID</p>
            <span>{orderDetails?._id}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-medium">Order Date</p>
            <span>{orderDetails?.orderDate.split("T")[0]}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-medium">Order Price</p>
            <span>${orderDetails?.totalAmount}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-medium">Payment Method</p>
            <span>{orderDetails?.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-medium">Payment Status</p>
            <span>{orderDetails?.paymentStatus}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-medium">Order Status</p>
            <span
              className={`px-3 py-1 text-white rounded ${
                orderDetails?.orderStatus === "confirmed"
                  ? "bg-green-500"
                  : orderDetails?.orderStatus === "rejected"
                  ? "bg-red-600"
                  : "bg-gray-700"
              }`}
            >
              {orderDetails?.orderStatus}
            </span>
          </div>
        </div>

        <hr className="border-gray-300" />

        <div>
          <h3 className="font-medium mb-2">Order Details</h3>
          <ul className="space-y-2">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>Title: {item.title}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ${item.price}</span>
                </li>
              ))
            ) : (
              <p>No items in this order.</p>
            )}
          </ul>
        </div>
        <hr className="border-gray-300" />
        <div>
          <h3 className="font-medium mb-2">Shipping Info</h3>
          <div className="space-y-1 text-gray-600">
            <p>{user.userName}</p>
            <p>{orderDetails?.addressInfo?.address}</p>
            <p>{orderDetails?.addressInfo?.city}</p>
            <p>{orderDetails?.addressInfo?.pincode}</p>
            <p>{orderDetails?.addressInfo?.phone}</p>
            <p>{orderDetails?.addressInfo?.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingOrderDetailsView;
