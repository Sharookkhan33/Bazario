import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authRoutes = [
    '/login',
    '/register',
    '/vendor-login',
    '/vendor-register',
    '/admin-login',
    '/admin-register',
  ];

  const showOnlyLogo = location.pathname.startsWith('/admin');
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Bazario</Link>

      {!showOnlyLogo && (
        <div className="space-x-4">
          {!isLoggedIn && !isAuthPage ? (
            <>
              <Link to="/login" className="text-blue-600 font-medium">Login</Link>
              <Link to="/register" className="text-blue-600 font-medium">Register</Link>
              <Link to="/vendor-login" className="text-blue-600 font-medium">Become Seller</Link>
            </>
          ) : null}

          {isLoggedIn && (
            <>
              <Link to="/cart">🛒 Cart</Link>
              <Link to="/wishlist">❤️ Wishlist</Link>
              <Link to="/account">👤 My Account</Link>
              <button onClick={handleLogout} className="ml-4 text-red-600">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;


