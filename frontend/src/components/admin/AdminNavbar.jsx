import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  return (
    <>
      <nav className="bg-blue-900 text-white flex justify-between items-center px-6 py-4 sticky top-0 z-50">
        <div className="text-2xl font-extrabold">Admin Panel</div>
        <div className="hidden md:flex space-x-6 items-center">
          {['dashboard', 'users', 'vendors', 'products', 'orders', 'banners', 'categories'].map((path) => (
            <Link
              key={path}
              to={`/admin-${path}`}
              className="hover:text-yellow-300 transition-colors duration-200"
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-900 text-white transform transition-transform duration-300 z-40
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col mt-16 space-y-6 px-6">
          {['dashboard', 'users', 'vendors', 'products', 'orders', 'banners', 'categories'].map((path) => (
            <Link
              key={path}
              to={`/admin-${path}`}
              onClick={() => setMenuOpen(false)}
              className="block text-lg hover:text-yellow-300 transition-colors duration-200"
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AdminNavbar;
