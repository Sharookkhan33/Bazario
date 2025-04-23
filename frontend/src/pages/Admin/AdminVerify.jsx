import React, { useState } from "react";
import api from "../../api/axios"
import { useNavigate } from "react-router-dom";

const AdminVerify = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("adminEmail");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/admin/verify-email", { email, emailOTP: otp });
      alert("Email verified successfully");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem('userType', 'admin');
      navigate("/admin-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center">Verify Admin Email</h2>
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="input" />
        <button type="submit" className="btn-primary w-full">Verify</button>
      </form>
    </div>
  );
};

export default AdminVerify;
