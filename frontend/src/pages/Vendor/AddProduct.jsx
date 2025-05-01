import React, { useState } from 'react';
import api from "../../api/axios";
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ui/ProductForm';
import toast from 'react-hot-toast';
import {Loader2} from '../../components/Loader'; // Import all loaders

const AddProduct = () => {
  const navigate = useNavigate();

  // State to track loading status
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (formData) => {
    setLoading(true); // Set loading to true before the API request starts

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("stock", formData.stock);
      data.append("discount", formData.discount);
      data.append("isFeatured", formData.isFeatured);
      formData.tags.forEach((tag) => data.append("tags[]", tag.trim())); // append tags as array

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      } else {
        data.append("image", formData.image); // Optional: for handling existing image URLs
      }

      const token = localStorage.getItem("token");

      const res = await api.post("/products/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product added successfully");
      navigate('/vendors/dashboard');
    } catch (err) {
      console.error("Add Product Error:", err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false); // Set loading to false when the API request completes
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-green-800">➕ Add New Product</h2>

      {/* Show Loader if loading is true */}
      {loading && <Loader2 />} {/* Change this to Loader1, Loader3, etc. based on your preference */}
      
      {/* Render Product Form */}
      <ProductForm onSubmit={handleAddProduct} />
    </div>
  );
};

export default AddProduct;
