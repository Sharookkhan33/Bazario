// src/pages/VendorLogin.jsx
import React, { useState,useContext} from 'react';
import api from "../../api/axios"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';



const VendorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleVendorLogin = async (e) => { 
    e.preventDefault();
    try {
      const response = await api.post('/vendors/login', {
        email,
        password,
      });
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'vendor');
      login(response.data.token, 'vendor');
  
      toast.success("Login Successful");
      navigate('/vendors/dashboard', { replace: true });
  
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('Your account has been rejected.');
        navigate('/vendor-rejected', { replace: true });
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Vendor Login</h2>
        <form onSubmit={handleVendorLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Vendor Email"
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
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
  Don't have an account?{' '}
  <Link to="/vendor-register" className="text-blue-600 hover:underline">
    Register
  </Link>
</p>
      </div>
    </div>
  );
};

export default VendorLogin;
