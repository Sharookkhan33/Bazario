// src/pages/admin/AdminCategoryManagement.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const emptyForm = {
  name: "",
  subtitle: "",
  slug: "",
  image: "",
  isActive: true,
  file: null,
};

const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef();

  const fetchAll = async () => {
    try {
      const { data } = await api.get("/categories/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") setForm(f => ({ ...f, file: files[0] }));
    else if (type === "checkbox") setForm(f => ({ ...f, [name]: checked }));
    else setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("subtitle", form.subtitle);
    fd.append("slug", form.slug);
    fd.append("isActive", form.isActive);
    if (form.file) fd.append("image", form.file);
    else fd.append("image", form.image);

    try {
      if (editingId) {
        await api.put(`/categories/update/${editingId}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Category updated");
      } else {
        await api.post("/categories/create", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Category created");
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const onEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ ...cat, file: null });
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Deleted");
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-lg shadow mb-10 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Category" : "Add Category"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Name"
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            name="subtitle"
            value={form.subtitle}
            onChange={onChange}
            placeholder="Subtitle"
            className="border px-4 py-2 rounded w-full"
          />
          <input
            name="slug"
            value={form.slug}
            onChange={onChange}
            placeholder="Slug"
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            name="image"
            value={form.image}
            onChange={onChange}
            placeholder="Image URL"
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={onChange}
            className="w-full"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="text-right">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition">
            {editingId ? "Update Category" : "Create Category"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="bg-white border shadow rounded-lg overflow-hidden relative group"
          >
            <img
              src={cat.image}
              alt={cat.name || "No Name"}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 min-h-[150px] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {cat.name || "Untitled"}
                </h3>
                <p className="text-sm text-gray-600">{cat.subtitle}</p>
                <p className="text-sm text-gray-500 mt-1">/{cat.slug}</p>
              </div>
              <p className="text-sm mt-2">
                Status:{" "}
                <span className={cat.isActive ? "text-green-600" : "text-red-500"}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => onEdit(cat)}
                className="bg-yellow-400 hover:bg-yellow-500 text-sm px-3 py-1 rounded shadow"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(cat._id)}
                className="bg-red-500 hover:bg-red-600 text-sm px-3 py-1 text-white rounded shadow"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoryManagement;
