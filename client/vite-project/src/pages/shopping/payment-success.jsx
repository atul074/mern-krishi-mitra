import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

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
