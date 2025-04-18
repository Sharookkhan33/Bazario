// src/routes/VendorRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const VendorRoute = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token || userType !== 'vendor') {
    return <Navigate to="/vendor-login" replace />;
  }

  return <Outlet />;
};

export default VendorRoute;
