import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"
import toast from 'react-hot-toast';

const VendorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("vendorForm");
    return saved ? JSON.parse(saved) : {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      businessAddress: "",
      gstNumber: "",
      bankDetails: {
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        ifscCode: "",
      },
    };
  });

  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpPhase, setOtpPhase] = useState(false);
  const [email, setEmail] = useState("");

  // Save form to localStorage on change
  useEffect(() => {
    localStorage.setItem("vendorForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("bankDetails.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: { ...prev.bankDetails, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("❌ Passwords do not match");
    }

    try {
      const res = await api.post("/vendors/register", formData);
      toast.success("✅ OTP sent to your email");
      setEmail(formData.email);
      setOtpPhase(true);
    } catch (error) {
      console.error("Register error:", error.response?.status, error.response?.data);
      toast.success(error.response?.data?.message || "Something went wrong");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await api.post("/vendors/verify-email", {
        email,
        emailOTP: otp,
      });

      localStorage.removeItem("vendorForm");
      toast.success("✅ Email verified!");
      navigate("/vendor/success");
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed");
    }
  };

  
const resendOtp = async () => {
  try {
    const res = await api.post("/vendors/resend-otp", {
      email,
    });
    toast.success(res.data.message); // ✅ Show success toast
  } catch (error) {
    const errMsg = error.response?.data?.message || "Resend OTP failed";
    toast.error(errMsg); // ✅ Show error toast
    console.error("Resend OTP error:", error); // optional debug log
  }
};
  
  
  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl p-8 rounded-lg shadow-md border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Bazario Seller Registration</h1>
        <p className="text-gray-600 mb-6">Join India's most trusted multi-vendor marketplace</p>

        {message && <div className="mb-4 text-sm text-red-600 font-medium">{message}</div>}

        {!otpPhase ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" type="text" name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} required />
            <input className="input" type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
            <input className="input" type="text" name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} required />
            <input className="input" type="text" name="businessName" placeholder="Business Name" onChange={handleChange} value={formData.businessName} required />
            <input className="input" type="text" name="businessAddress" placeholder="Business Address" onChange={handleChange} value={formData.businessAddress} required />
            <input className="input" type="text" name="gstNumber" placeholder="GST Number (optional)" onChange={handleChange} value={formData.gstNumber} />
            <input className="input" type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} required />
            <input className="input" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} value={formData.confirmPassword} required />

            <input className="input" type="text" name="bankDetails.accountHolderName" placeholder="Account Holder Name" onChange={handleChange} value={formData.bankDetails.accountHolderName} required />
            <input className="input" type="text" name="bankDetails.accountNumber" placeholder="Account Number" onChange={handleChange} value={formData.bankDetails.accountNumber} required />
            <input className="input" type="text" name="bankDetails.bankName" placeholder="Bank Name" onChange={handleChange} value={formData.bankDetails.bankName} required />
            <input className="input" type="text" name="bankDetails.ifscCode" placeholder="IFSC Code" onChange={handleChange} value={formData.bankDetails.ifscCode} required />

            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
                Register & Send OTP
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">Enter the OTP sent to <strong>{email}</strong></p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input"
            />
            <button onClick={verifyOtp} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
              Verify OTP
            </button>
            <button onClick={resendOtp} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded">
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorRegister;
