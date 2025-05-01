import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialBannerForm = {
  title: "",
  subtitle: "",
  image: "",
  link: "",
  isActive: true,
  file: null,
};

const AdminBannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState(initialBannerForm);
  const [editingId, setEditingId] = useState(null);

  const formRef = useRef();

  const fetchBanners = async () => {
    try {
      const res = await api.get("/banners/admin-all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBanners(res.data);
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      toast.error("Failed to fetch banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, file: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    fd.append("title", formData.title);
    fd.append("subtitle", formData.subtitle);
    fd.append("link", formData.link);
    fd.append("isActive", formData.isActive);
    if (formData.file) {
      fd.append("image", formData.file);
    } else {
      fd.append("image", formData.image);
    }

    try {
      if (editingId) {
        await api.put(`/banners/update/${editingId}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Banner updated successfully");
      } else {
        await api.post("/banners/create-banner", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Banner created successfully");
      }

      setFormData(initialBannerForm);
      setEditingId(null);
      fetchBanners();
    } catch (err) {
      console.error("Failed to save banner:", err);
      toast.error("Failed to save banner");
    }
  };
  const toggleBannerStatus = async (id, newStatus) => {
    try {
      await api.put(
        `/banners/status/${id}`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`Banner ${newStatus ? "activated" : "deactivated"}!`);
      fetchBanners();
    } catch (err) {
      console.error("Status toggle failed:", err);
      toast.error("Failed to update banner status.");
    }
  };
  
  const handleEdit = (banner) => {
    setEditingId(banner._id);
    setFormData({ ...banner, file: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      await api.delete(`/banners/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Banner deleted");
      fetchBanners();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Banner Management</h1>

      {/* Banner Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-10 space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">
          {editingId ? "Edit Banner" : "Add New Banner"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Link (optional)"
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
          >
            {editingId ? "Update Banner" : "Create Banner"}
          </button>
        </div>
      </form>

      {/* Banner List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white border shadow rounded-lg overflow-hidden relative group"
          >
            <img
              src={banner.image}
              alt={banner.title || "Banner Image"}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex flex-col justify-between min-h-56">
  <h3 className="text-lg font-semibold">{banner.title || "Untitled"}</h3>
  <p className="text-sm text-gray-600">{banner.subtitle}</p>
              {banner.link && (
                <p className="text-sm text-blue-500 break-words">{banner.link}</p>
              )}
              <p className="text-sm mt-1">
                Status:{" "}
                <span className={banner.isActive ? "text-green-600" : "text-red-500"}>
                  {banner.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>

            {/* Fixed Buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(banner)}
                className="bg-yellow-400 hover:bg-yellow-500 text-sm px-3 py-1 rounded shadow"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                className="bg-red-500 hover:bg-red-600 text-sm px-3 py-1 text-white rounded shadow"
              >
                Delete
              </button>
              <button
  onClick={() => toggleBannerStatus(banner._id, !banner.isActive)}
  className={`${
    banner.isActive ? "text-yellow-500" : "text-green-600"
  } hover:underline`}
>
  {banner.isActive ? "Deactivate" : "Activate"}
</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBannerManagement;
