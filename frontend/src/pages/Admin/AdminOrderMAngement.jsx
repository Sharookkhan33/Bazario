import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/all?status=${status}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
      toast.success("Order status updated!");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update status";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchEarnings();
  }, [status]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Admin Order Management</h1>

      {earnings !== null && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-800 font-semibold">
          💰 Total Earnings: ₹{earnings.toFixed(2)}
        </div>
      )}

      <div className="mb-6">
        <label className="font-medium mr-2">Filter by Status:</label>
        <select
          className="p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
        <p className="text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-xl shadow border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between flex-col md:flex-row">
                <div>
                  <p className="font-semibold text-gray-800">
                    🧾 Order ID: <span className="text-blue-600">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    By: {order.user?.email || "Unknown User"}
                  </p>
                </div>
                <div className="mt-3 md:mt-0">
                  <label className="text-sm font-medium text-gray-600 mr-2">Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                <p className="font-semibold text-gray-700">📦 Items:</p>
                <ul className="ml-5 list-disc text-gray-600">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity} = ₹{item.subtotal}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                <p className="font-semibold text-lg">
                  Total: ₹{order.totalAmount.toFixed(2)}
                </p>
                <p
                  className={`text-sm mt-2 md:mt-0 font-medium ${
                    order.paymentStatus === "pending"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  Payment Status: {order.paymentStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
