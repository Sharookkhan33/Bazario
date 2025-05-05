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
      formRef.current?.reset();
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const onEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ ...cat, file: null });
    formRef.current.scrollIntoView({ behavior: "smooth" });
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
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center">
        Category Management
      </h1>

      {/* Category Form */}
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg mb-12 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Name"
            required
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
          />
          <input
            name="subtitle"
            value={form.subtitle}
            onChange={onChange}
            placeholder="Subtitle"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
          />
          <input
            name="slug"
            value={form.slug}
            onChange={onChange}
            placeholder="Slug"
            required
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
          />
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={onChange}
            placeholder="Image URL"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
          />
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={onChange}
              className="w-full text-gray-600"
            />
          </div>
          <label className="col-span-full flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
              className="h-5 w-5 text-indigo-600"
            />
            <span className="text-gray-700 font-medium">Active</span>
          </label>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-transform transform hover:scale-105"
          >
            {editingId ? "Update Category" : "Create Category"}
          </button>
        </div>
      </form>

      {/* Category List */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
          >
            <img
              src={cat.image}
              alt={cat.name || "Category Image"}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                {cat.name || "Untitled"}
              </h3>
              <p className="text-gray-600">{cat.subtitle}</p>
              <p className="text-gray-500 text-sm">/{cat.slug}</p>
              <p className="text-sm mt-2">
                Status:{' '}
                <span className={
                  cat.isActive ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'
                }>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <div className="absolute top-2 right-2 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-1">
              <button
                onClick={() => onEdit(cat)}
                className="bg-yellow-400 hover:bg-yellow-500 text-xs px-3 py-1 rounded-lg shadow"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(cat._id)}
                className="bg-red-500 hover:bg-red-600 text-xs px-3 py-1 text-white rounded-lg shadow"
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
