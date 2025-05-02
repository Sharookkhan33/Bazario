// src/routes/PublicRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isLoggedIn, userType } = useContext(AuthContext);

  if (isLoggedIn) {
    switch (userType) {
      case 'vendor':
        return <Navigate to="/vendors/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;

