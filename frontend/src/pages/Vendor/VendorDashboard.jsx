import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios";

const VendorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/vendors/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboard(res.data);

        // Replace current history entry to prevent going back
        navigate('/vendors/dashboard', { replace: true });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        navigate('/vendor-login'); // fallback if unauthorized or error
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (!dashboard) return <p className="text-center mt-10">Loading dashboard...</p>;

  const { totalOrders, pendingOrders, totalRevenue, productPerformance } = dashboard;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-800">📊 Vendor Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded p-4 border-t-4 border-green-600">
          <h4 className="font-semibold text-gray-700">Total Orders</h4>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded p-4 border-t-4 border-yellow-500">
          <h4 className="font-semibold text-gray-700">Pending Orders</h4>
          <p className="text-xl font-bold">{pendingOrders}</p>
        </div>
        <div className="bg-white shadow rounded p-4 border-t-4 border-blue-600">
          <h4 className="font-semibold text-gray-700">Total Revenue</h4>
          <p className="text-xl font-bold">₹{totalRevenue}</p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">📦 Product Performance</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="text-left py-2 px-4">Product</th>
              <th className="text-left py-2 px-4">Quantity Sold</th>
              <th className="text-left py-2 px-4">Revenue (₹)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(productPerformance).map(([productId, product]) => (
              <tr key={productId} className="border-t">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.quantity}</td>
                <td className="py-2 px-4">₹{product.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorDashboard;
