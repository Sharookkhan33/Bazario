import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(res.data);
    } catch (err) {
      alert("Error loading dashboard");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">Users: {data.totalUsers}</div>
        <div className="card">Vendors: {data.totalVendors}</div>
        <div className="card">Orders: {data.totalOrders}</div>
        <div className="card">Earnings: ₹{data.totalEarnings}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
