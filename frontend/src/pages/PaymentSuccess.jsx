import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const confirmPayment = async () => {
      const params = new URLSearchParams(location.search);
      const session_id = params.get("session_id");

      if (session_id) {
        try {
          const res = await api.post("/payments/confirm-payment", { session_id },{
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          console.log(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    confirmPayment();
  }, [location]);

  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4">Thank you for your purchase.</p>
      <button onClick={() => navigate("/home")} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
