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

        navigate('/vendors/dashboard', { replace: true });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        navigate('/vendor-login');
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (!dashboard) {
    return <p className="text-center mt-10 text-gray-600">Loading dashboard...</p>;
  }

  const { totalOrders, pendingOrders, totalRevenue, productPerformance } = dashboard;

  return (
    <div className="p-6 max-w-5xl mx-auto mt-20 md:mt-24">

      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-green-800">📊 Vendor Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-green-600">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h4>
          <p className="text-2xl font-semibold text-gray-800">{totalOrders}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-yellow-500">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Pending Orders</h4>
          <p className="text-2xl font-semibold text-gray-800">{pendingOrders}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 border-t-4 border-blue-600">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h4>
          <p className="text-2xl font-semibold text-gray-800">₹{totalRevenue}</p>
        </div>
      </div>

      {/* Product Table */}
      <h3 className="text-2xl font-semibold mb-4 text-green-700">📦 Product Performance</h3>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="text-left py-3 px-4">Product</th>
              <th className="text-left py-3 px-4">Quantity Sold</th>
              <th className="text-left py-3 px-4">Revenue (₹)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(productPerformance).map(([productId, product], index) => (
              <tr
                key={productId}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="py-3 px-4 whitespace-nowrap">{product.name}</td>
                <td className="py-3 px-4">{product.quantity}</td>
                <td className="py-3 px-4">₹{product.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorDashboard;
