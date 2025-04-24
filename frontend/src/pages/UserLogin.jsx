import React, { useState, useContext } from 'react';
import api from "../api/axios";
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ Context function

  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'user'); // optional
      login(response.data.token,'user');
      navigate('/'); // ✅ Redirect
    } catch (error) {
      console.error('Login failed', error);
      alert(error.response?.data?.message || 'Login failed. Please check your credentials.');

    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">User Login</h2>
        <form onSubmit={handleUserLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
