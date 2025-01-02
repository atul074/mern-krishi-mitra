import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getAllOrdersForAdmin,getOrderDetailsForAdmin,updateOrderStatus,} from "../../store/admin/order-slice";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        alert(data?.payload?.message);
      }
    });
  }

  return (
    <div className="p-6 bg-gray-200 rounded-md shadow-md overflow-y-scroll">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="font-medium">Order ID</p>
            <span>{orderDetails?._id}</span>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Order Date</p>
            <span>{orderDetails?.orderDate.split("T")[0]}</span>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Order Price</p>
            <span>${orderDetails?.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Payment Method</p>
            <span>{orderDetails?.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Payment Status</p>
            <span>{orderDetails?.paymentStatus}</span>
          </div>
          <div className="flex justify-between">
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

        <hr className="my-4 border-gray-300" />

        <div>
          <h3 className="font-medium">Order Details</h3>
          <ul className="space-y-2">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
              orderDetails?.cartItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>Title: {item.title}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ${item.price}</span>
                </li>
              ))
            ) : (
              <p>No items found in this order.</p>
            )}
          </ul>
        </div>
        <hr className="my-4 border-gray-300" />
        <div>
          <h3 className="font-medium">Shipping Info</h3>
          <div className="space-y-1 text-gray-600">
            <p>{user.userName}</p>
            <p>{orderDetails?.addressInfo?.address}</p>
            <p>{orderDetails?.addressInfo?.city}</p>
            <p>{orderDetails?.addressInfo?.pincode}</p>
            <p>{orderDetails?.addressInfo?.phone}</p>
            <p>{orderDetails?.addressInfo?.notes}</p>
          </div>
        </div>
        <hr className="my-4 border-gray-300" />
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label htmlFor="status" className="block font-medium">
              Order Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full mt-1 border py-1 border-gray-200 shadow-md rounded-md  focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="inProcess">In Process</option>
              <option value="inShipping">In Shipping</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center justify-center">
          <button
            type="submit"
            className="px-3 py-2 w-full font-medium rounded-lg bg-[#02353c] hover:bg-[#f2f2f2] hover:text-[#02353c] text-white border-2 border-[#02353c] object-center"
          >
            Update Order Status
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminOrderDetailsView;
