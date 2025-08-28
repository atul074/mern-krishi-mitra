



import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const order_data = JSON.parse(sessionStorage.getItem("order_data"));

  useEffect(() => {
    const sendSMS = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/shop/order/sendSms`, {
          orderId: orderData.id,
          to: orderData.addressInfo.phone,
          body: `Your order ${orderData.id} has been confirmed! Total: $${orderData.totalAmount}. Thank you for shopping with us.`
        }, {
          withCredentials: true,
        });
        console.log("SMS sent successfully");
      } catch (err) {
        console.error("Failed to send SMS:", err.response?.data || err.message);
      }
    };

    if (order_data?.addressInfo?.phone) {
      sendSMS();
    }

    sessionStorage.removeItem("order_data");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white rounded shadow-md text-center">
        <h1 className="text-4xl font-bold text-gray-700">
          Payment is successful!
        </h1>
        <button
          className="mt-5 px-6 py-2 bg-[#02353c] hover:bg-gray-200 hover:text-[#02353c] hover:border-2 border-[#02353c] text-white rounded-xl"
          onClick={() => navigate("/shop/account")}
        >
          View Orders
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
