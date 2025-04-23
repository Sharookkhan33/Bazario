import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <nav className="bg-blue-900 text-white flex justify-between items-center px-6 py-3 sticky top-0 z-50">
      <div className="text-xl font-bold">Admin Panel</div>
      <div className="space-x-4">
        <Link to="/admin-dashboard" className="hover:text-yellow-300">Dashboard</Link>
        <Link to="/admin-users" className="hover:text-yellow-300">Users</Link>
        <Link to="/admin-vendors" className="hover:text-yellow-300">Vendors</Link>
        <button onClick={handleLogout} className="hover:text-red-300">Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
