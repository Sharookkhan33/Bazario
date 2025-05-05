import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const statusOptions = ["processing", "shipped", "delivered"];

  useEffect(() => {
    fetchVendorOrders();
    fetchVendorDashboard();
  }, []);

  const fetchVendorOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/orders/vendor-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/vendors/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalRevenue(res.data.totalRevenue);
    } catch (err) {
      toast.error("Failed to fetch revenue data");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/orders/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchVendorOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading)
    return <p className="text-center py-6 text-gray-600">Loading orders...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto mt-20 md:mt-24">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700">
        🧾 Your Orders
      </h1>

      {totalRevenue !== null && (
        <div className="mb-6">
          <p className="text-lg sm:text-xl font-semibold text-green-700">
            💰 Total Revenue: ₹{totalRevenue.toFixed(2)}
          </p>
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-2xl p-4 sm:p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div>
                <p className="font-semibold text-base sm:text-lg text-gray-800">
                  Order ID:{" "}
                  <span className="text-blue-600 break-all">{order._id}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600">
                  Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2 text-gray-700">
                🛒 Ordered Items:
              </p>
              <ul className="ml-4 list-disc text-sm text-gray-600">
                {order.items.map((item, index) => (
                  <li key={index} className="mb-1">
                    <span className="font-medium">{item.name}</span> - ₹
                    {item.price} × {item.quantity} = ₹{item.subtotal}{" "}
                    <span className="text-xs text-gray-500 block md:inline">
                      (ID: {item.product?._id || item.product || "N/A"})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <p
                className={`font-semibold text-base ${
                  order.paymentStatus === "pending"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                Total: ₹{order.totalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Payment Status:{" "}
                <span className="font-semibold">{order.paymentStatus}</span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorOrders;
