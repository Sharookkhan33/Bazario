import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const VendorProductManagement = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const res = await api.get("/products/vendor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching vendor products", err);
      }
    };
    fetchVendorProducts();
  }, [token]);

  const handleEdit = (id) => navigate(`/vendors/edit-product/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(prev => prev.filter(p => p._id !== id));
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/products/toggle-status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, isActive: res.data.product.isActive } : p));
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Failed to update product status");
    }
  };

  const handleAddProduct = () => navigate("/vendors/add-product");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Your Products</h2>
        <button
          onClick={handleAddProduct}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          ➕ Add Product
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        ) : (
          products.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition flex flex-col"
            >
              <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                <p className="text-indigo-600 font-bold">₹{product.price}</p>
                <p className="text-gray-600 text-sm mt-1">Stock: {product.stock}</p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={product.isActive}
                      onChange={() => handleToggleStatus(product._id)}
                      aria-label={product.isActive ? 'Deactivate product' : 'Activate product'}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
                  </label>
                </div>

                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-center transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-center transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorProductManagement;
