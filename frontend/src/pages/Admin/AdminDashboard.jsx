import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Card from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#FF8042"];

function formatCurrency(amount) {
  if (amount >= 1e7) return (amount / 1e7).toFixed(2) + ' Cr';
  if (amount >= 1e5) return (amount / 1e5).toFixed(2) + ' L';
  if (amount >= 1e3) return (amount / 1e3).toFixed(2) + ' K';
  return amount.toLocaleString('en-IN');
}


const AdminDashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalEarnings: 0,
    pendingVendors: 0,
    pendingProducts: 0,
    ordersByMonth: [], // [{ month: 'Jan', count: 10 }, ...]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: "Total Users", value: data.totalUsers, color: "bg-blue-800" },
    { title: "Total Vendors", value: data.totalVendors, color: "bg-green-900" },
    { title: "Total Orders", value: data.totalOrders, color: "bg-yellow-500" },
    {
      title: "Total Earnings",
      value: `₹${formatCurrency(data.totalEarnings)}`,
      color: "bg-purple-700"
    }
    
  ];

  const pendingData = [
    { name: 'Vendors', value: data.pendingVendors },
    { name: 'Products', value: data.pendingProducts },
  ];

  return (
    <div className="p-6 space-y-8 max-w-screen-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-indigo-700">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className={`p-6 flex flex-col items-center justify-center text-white ${stat.color} rounded-2xl shadow-lg hover:shadow-2xl transition-shadow`}>
            <div className="text-5xl font-extrabold">{stat.value}</div>
            <div className="text-xl mt-2">{stat.title}</div>
          </Card>
        ))}
      </div>

      {/* Pending Requests Pie Chart */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 h-80 bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pendingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Over Time Bar Chart */}
        <div className="w-full lg:w-1/2 h-80 bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-2xl font-semibold mb-4">Orders by Month</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.ordersByMonth} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
