import React, { useState } from 'react';
import api from "../../api/axios";
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ui/ProductForm';
import toast from 'react-hot-toast';
import { Loader2 } from '../../components/Loader';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (formData) => {
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("stock", formData.stock);
      data.append("discount", formData.discount);
      data.append("isFeatured", formData.isFeatured);
      formData.tags.forEach((tag) => data.append("tags[]", tag.trim()));

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      } else {
        data.append("image", formData.image);
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
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 p-6 bg-gray-100 min-h-screen max-w-xl mx-auto mt-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center text-green-700">
          ➕ Add New Product
        </h2>

        {loading && (
          <div className="flex justify-center mb-4">
            <Loader2 />
          </div>
        )}

        <ProductForm onSubmit={handleAddProduct} />
      </div>
    </div>
  );
};

export default AddProduct;
