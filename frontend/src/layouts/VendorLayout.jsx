// src/layouts/VendorLayout.jsx
import React from 'react';
import VendorNavbar from '../components/VendorNavbar';
import { Outlet } from 'react-router-dom';

const VendorLayout = () => {
  return (
    <div>
      <VendorNavbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
