import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function ManageAddressSection() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    api
      .get("/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const u = res.data;
        setUserId(u._id);
        setAddress(u.shippingAddress || {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        });
      })
      .catch(() => toast.error("Failed to load address"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((a) => ({ ...a, [name]: value }));
  };

  const handleSave = () => {
    if (!userId) return toast.error("User ID missing");
    api
      .put(
        `/users/update/${userId}`,
        { shippingAddress: address },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => toast.success("Address saved"))
      .catch(() => toast.error("Save failed"));
  };

  if (loading) return <p className="text-center py-6 text-gray-600">Loading address…</p>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Manage Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
          <input
            name="addressLine1"
            value={address.addressLine1}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
          <input
            name="addressLine2"
            value={address.addressLine2}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            name="city"
            value={address.city}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            name="state"
            value={address.state}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input
            name="postalCode"
            value={address.postalCode}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            name="country"
            value={address.country}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}
