import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
      <p className="mt-4">Something went wrong with your payment.</p>
      <button onClick={() => navigate("/home")} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
        Try Again
      </button>
    </div>
  );
};

export default PaymentFailed;
