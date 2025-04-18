// src/components/VendorNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const VendorNavbar = () => {
  return (
    <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">Vendor Dashboard</div>
      <div className="space-x-4">
        <Link to="/vendors/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/vendors/profile" className="hover:underline">My Account</Link>
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

export default VendorNavbar;
