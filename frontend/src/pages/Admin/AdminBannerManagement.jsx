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
    if (formData.file) fd.append("image", formData.file);
    else fd.append("image", formData.image);

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
      formRef.current?.reset();
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
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success(
        `Banner ${newStatus ? "activated" : "deactivated"}!`
      );
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
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800 text-center">
        Banner Management
      </h1>

      {/* Banner Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg mb-12 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          {editingId ? "Edit Banner" : "Add New Banner"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 w-full"
          />
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 w-full"
          />
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Link (optional)"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 w-full"
          />
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 w-full"
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-600"
            />
          </div>
          <label className="md:col-span-2 flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 font-medium">Active</span>
          </label>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-transform transform hover:scale-105"
          >
            {editingId ? "Update Banner" : "Create Banner"}
          </button>
        </div>
      </form>

      {/* Banner List */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
          >
            <img
              src={banner.image}
              alt={banner.title || "Banner Image"}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                {banner.title || "Untitled"}
              </h3>
              <p className="text-gray-600">{banner.subtitle}</p>
              {banner.link && (
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 break-words hover:underline"
                >
                  {banner.link}
                </a>
              )}
              <p className="text-sm">
                Status:{' '}
                <span
                  className={
                    banner.isActive ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'
                  }
                >
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <div className="absolute top-2 right-2 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-1">
              <button
                onClick={() => handleEdit(banner)}
                className="bg-yellow-400 hover:bg-yellow-500 text-xs px-3 py-1 rounded-lg shadow"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                className="bg-red-500 hover:bg-red-600 text-xs px-3 py-1 text-white rounded-lg shadow"
              >
                Delete
              </button>
              <button
                onClick={() => toggleBannerStatus(banner._id, !banner.isActive)}
                className="text-xs hover:underline"
              >
                {banner.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBannerManagement;