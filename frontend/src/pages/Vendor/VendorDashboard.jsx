// src/pages/Vendor/VendorDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const VendorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/vendors/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboard(res.data);
    };
    fetchDashboard();
  }, []);

  if (!dashboard) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <p><strong>Total Orders:</strong> {dashboard.totalOrders}</p>
        <p><strong>Pending Orders:</strong> {dashboard.pendingOrders}</p>
        <p><strong>Total Revenue:</strong> ₹{dashboard.totalRevenue}</p>
      </div>
    </>
  );
};

export default VendorDashboard;
