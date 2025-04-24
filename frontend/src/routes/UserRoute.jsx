import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UserRoute = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  if (!token || userType !== "user") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default UserRoute;
