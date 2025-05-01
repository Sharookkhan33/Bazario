import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const UserProfileSection = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const u = res.data;
        setUserId(u._id);
        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || ""
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("User ID not available");

    try {
      await api.put(`/users/update/${userId}`, {
        name: form.name,
        phone: form.phone
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  };

  if (loading) {
    return <p className="text-center py-6 text-gray-600">Loading profile…</p>;
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow">
          {getInitials(form.name)}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-2xl font-bold text-gray-800">{form.name || "No Name"}</h2>
          <p className="text-gray-500">{form.email}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your phone"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileSection;
