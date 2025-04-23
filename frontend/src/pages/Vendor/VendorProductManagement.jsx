import React, { useEffect, useState } from "react";
import api from "../../api/axios"
import { useNavigate } from "react-router-dom";

const VendorProductManagement = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const res = await api.get("/products/vendor", {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching vendor products", err);
      }
    };

    fetchVendorProducts();
  }, [token]);

  const handleEdit = (id) => {
    navigate(`/vendors/edit-product/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/products/toggle-status/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update product in local state
      setProducts(products.map((p) =>
        p._id === id ? { ...p, isActive: res.data.product.isActive } : p
      ));
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Failed to update product status");
    }
  };

  const handleAddProduct = () => {
    navigate("/vendors/add-product");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Products</h2>
        <button
          onClick={handleAddProduct}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition bg-white flex flex-col justify-between"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-fill h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-700 mb-2">₹{product.price}<br/>Stock: {product.stock}</p>

            {/* Status Row */}
            <div className="flex items-center justify-between mt-auto">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
              >
                {product.isActive ? "Active" : "Not Active"}
              </span>

              {/* Toggle Switch */}
              <label className="inline-flex items-center cursor-pointer space-x-2">
  <input
    type="checkbox"
    checked={product.isActive}
    onChange={() => handleToggleStatus(product._id)}
    className="sr-only peer"
    aria-label={product.isActive ? "Deactivate product" : "Activate product"}
  />
  
  <div className="relative w-12 h-6">
    {/* Track */}
    <div className={`
      w-full h-full rounded-full transition-colors duration-300
      ${product.isActive ? 'bg-green-500' : 'bg-gray-300'}
    `}></div>
    
    {/* Thumb */}
    <div className={`
      absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm
      transition-transform duration-300
      ${product.isActive ? 'translate-x-6' : 'translate-x-0.5'}
    `}></div>
  </div>
</label>

            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(product._id)}
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
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

export default VendorProductManagement;
