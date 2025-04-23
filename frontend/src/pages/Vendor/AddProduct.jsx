// src/pages/Vendor/AddProduct.jsx
import React from 'react';
import api from "../../api/axios"
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ui/ProductForm';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();

  const handleAddProduct = async (formData) => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("stock", formData.stock);
      
      if (formData.image instanceof File) {
        data.append("image", formData.image);
      } else {
        data.append("image", formData.image); // Optional: for handling existing image URLs
      }

      const token = localStorage.getItem("token");

      const res = await api.post("/api/products/add", data, {
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
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-green-800">➕ Add New Product</h2>
      <ProductForm onSubmit={handleAddProduct} />
    </div>
  );
};

export default AddProduct;
