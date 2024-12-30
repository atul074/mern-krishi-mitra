import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminOrderDetailsView from "./order-details";
import {getAllOrdersForAdmin,getOrderDetailsForAdmin,resetOrderDetails,} from "../../store/admin/order-slice";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <div className="bg-white shadow-md rounded-md p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">All Orders</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Order Date</th>
              <th className="px-4 py-2 text-left">Order Status</th>
              <th className="px-4 py-2 text-left">Order Price</th>
              <th className="px-4 py-2 text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <tr key={orderItem?._id} className="border-b">
                  <td className="px-4 py-2">{orderItem?._id}</td>
                  <td className="px-4 py-2">
                    {orderItem?.orderDate.split("T")[0]}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`py-1 px-3 rounded text-white ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-gray-700"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">${orderItem?.totalAmount}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openDetailsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-md p-5 w-11/12 max-w-lg">
            <button
              onClick={() => {
                setOpenDetailsDialog(false);
                dispatch(resetOrderDetails());
              }}
              className="mb-4 text-red-500 font-medium border border-red-500 px-1"
            >
              Close
            </button>
            <div>
              {/* Replace this with your order details component */}
              <AdminOrderDetailsView orderDetails={orderDetails} />
              <h3 className="text-lg font-semibold mb-2">Order Details</h3>
              {/* <pre className="bg-gray-100 p-2 rounded">
                {JSON.stringify(orderDetails, null, 2)}
              </pre> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersView;
