import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const VendorNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/vendor-login';
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-green-700 text-white height: 80px; shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="text-xl font-bold">Vendor Dashboard</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/vendors/orders" className="hover:underline">Order Management</Link>
            <Link to="/vendors/product-manage" className="hover:underline">Product Management</Link>
            <Link to="/vendors/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/vendors/profile" className="hover:underline">My Account</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Hamburger for Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Right Sidebar for Mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-green-800 text-white transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-green-600">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col px-4 py-4 space-y-4">
          <Link to="/vendors/orders" className="hover:underline" onClick={() => setIsOpen(false)}>Order Management</Link>
          <Link to="/vendors/product-manage" className="hover:underline" onClick={() => setIsOpen(false)}>Product Management</Link>
          <Link to="/vendors/dashboard" className="hover:underline" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/vendors/profile" className="hover:underline" onClick={() => setIsOpen(false)}>My Account</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default VendorNavbar;
