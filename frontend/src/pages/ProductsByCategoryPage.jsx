import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import ProductCard from '../components/ui/ProductCard';

const ProductsByCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const categories = searchParams.get("categories");

  useEffect(() => {
    if (categories) {
      api.get(`/products?categories=${encodeURIComponent(categories)}`)
        .then((res) => setProducts(res.data))
        .catch(console.error);
    }
  }, [categories]);

  return (
    <div className="space-y-12 p-4 mt-12"> {/* Adds space between the navbar and the product cards */}
      <h2 className="text-2xl font-bold mb-4">Products in {categories} Category</h2>
      
      {products.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(prod => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products found.</p>
      )}
    </div>
  );
}

export default ProductsByCategoryPage;
