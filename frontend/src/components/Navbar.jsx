import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Bazario</Link>
      <div className="space-x-4">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-blue-600 font-medium">Login</Link>
            <Link to="/register" className="text-blue-600 font-medium">Register</Link>
            <Link to="/vendor-login" className="text-blue-600 font-medium">Become Seller</Link>
          </>
        ) : (
          <>
            <Link to="/cart">🛒 Cart</Link>
            <Link to="/wishlist">❤️ Wishlist</Link>
            <Link to="/account">👤 My Account</Link>
            <button onClick={handleLogout} className="ml-4 text-red-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


