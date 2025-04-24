import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  
  return (
    <nav className="bg-blue-900 text-white flex justify-between items-center px-6 py-3 sticky top-0 z-50">
      <div className="text-xl font-bold">Admin Panel</div>
      <div className="space-x-4">
        <Link to="/admin-dashboard" className="hover:text-yellow-300">Dashboard</Link>
        <Link to="/admin-users" className="hover:text-yellow-300">Users</Link>
        <Link to="/admin-vendors" className="hover:text-yellow-300">Vendors</Link>
        <Link to="/admin-products" className="hover:text-yellow-300">Products</Link>
        <Link to="/admin-orders" className="hover:text-yellow-300">Orders</Link>
        <button onClick={() => {
          localStorage.clear();
          window.location.href = '/vendor-login';
        }} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
