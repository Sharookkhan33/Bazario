import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/all?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    try {
      const res = await api.get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEarnings(res.data.totalEarnings);
    } catch (err) {
      toast.error("Failed to fetch earnings");
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(
        `/orders/update-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchOrders();
      toast.success("Order status updated!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update status";
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchEarnings();
  }, [statusFilter]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800 text-center">
        Admin Order Management
      </h1>

      {earnings !== null && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-semibold text-center">
          💰 Total Earnings: ₹{earnings.toFixed(2)}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <label className="font-medium text-gray-700">Filter by Status:</label>
        <select
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    🧾 Order ID: <span className="text-blue-600">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    By: {order.user?.email || "Unknown"}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <label className="text-sm font-medium text-gray-600 mr-2">Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-gray-700 mb-1">📦 Items:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.subtotal.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="font-bold text-lg text-gray-800">
                  Total: ₹{order.totalAmount.toFixed(2)}
                </p>
                <span className={`mt-2 md:mt-0 font-medium text-sm ${order.paymentStatus === "pending" ? "text-red-600" : "text-green-600"}`}>
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
