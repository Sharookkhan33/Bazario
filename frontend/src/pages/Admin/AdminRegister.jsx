import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"
import { Link } from "react-router-dom";

const AdminRegister = () => {
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", password: "", secretKey: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/admin/register", form);
      localStorage.setItem("adminEmail", form.email);
      navigate("/admin-verify");
    } catch (err) {
      alert(err.response?.data?.message || "Registration error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Secret Admin Register</h2>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="input" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input" />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="input" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="input" />
        <input type="text" name="secretKey" placeholder="Secret Key" onChange={handleChange} required className="input" />
        <button type="submit" className="btn-primary w-full">Register</button>
        <p className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/admin-login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
      </form>
    </div>
  );
};

export default AdminRegister;
