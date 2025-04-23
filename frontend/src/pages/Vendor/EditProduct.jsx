// src/pages/Vendor/EditProduct.jsx
import React, { useEffect, useState } from 'react';
import api from "../../api/axios"
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ui/ProductForm';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInitialData(res.data.product); // assuming your backend returns { product: { ... } }
        setLoading(false);
      } catch (err) {
        console.error('Fetch Product Error:', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleUpdateProduct = async (updatedData) => {
    try {
      const formData = new FormData();
  
      // Check if the image is a File (uploaded by user)
      const isFile = updatedData.image instanceof File;
  
    if (formData.image instanceof File) {
        formData.append("image", formData.image);
      } else {
        formData.append("image", formData.image); // Optional: for handling existing image URLs
      }

  
      // Append all other fields to formData (or as raw JSON if image is a URL)
      Object.entries(updatedData).forEach(([key, value]) => {
        if (key !== 'image' || isFile) {
          formData.append(key, value);
        }
      });
  
      await api.put(
        `/products/update/${id}`,
        isFile ? formData : updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(isFile && { 'Content-Type': 'multipart/form-data' }),
          },
        }
      );
  
      navigate('/vendors/dashboard');
    } catch (err) {
      console.error('Update Product Error:', err);
    }
  };
  

  if (loading) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-green-800">✏️ Edit Product</h2>
      <ProductForm initialData={initialData} onSubmit={handleUpdateProduct} />
    </div>
  );
};

export default EditProduct;
