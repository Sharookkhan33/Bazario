import React, { useEffect, useState } from 'react';
import api from "../../api/axios"
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ui/ProductForm';
import {Loader2} from '../../components/Loader';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove _id and reviews (and any other unneeded fields if necessary)
        const { _id, reviews, ...cleanedProduct } = res.data.product;
        setInitialData(cleanedProduct);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Product Error:', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleUpdateProduct = async (formData) => {
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

      await api.put(`/products/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/vendors/dashboard');
    } catch (err) {
      console.error('Update Product Error:', err);
    }finally {
      setLoading(false); // Set loading to false when the API request completes
    }
  };


  return (
   <div className="pt-20 p-6 bg-gray-100 min-h-screen max-w-xl mx-auto mt-10">
      {loading && <Loader2 />}
      <h2 className="text-2xl font-bold mb-4 text-green-800">✏️ Edit Product</h2>
      <ProductForm initialData={initialData} onSubmit={handleUpdateProduct}  mode="edit" />
    </div>
  );
};

export default EditProduct;
