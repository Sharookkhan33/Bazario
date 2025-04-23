import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminLogin = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post("/admin/login", form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem('userType', 'admin');
            navigate("/admin-dashboard");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-center">Admin Login</h2>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input" />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="input"
                    autoComplete="current-password" 
                />

                <button type="submit" className="btn-primary w-full">Login</button>
                <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/admin-register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
            </form>
            
        </div>
    );
};

export default AdminLogin;
