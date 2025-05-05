import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // fixed path if needed

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex overflow-x-auto gap-4 px-4">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="flex-shrink-0 cursor-pointer border rounded-lg p-3 text-center hover:shadow-md min-w-[120px]"
          onClick={() => navigate(`/product?categories=${encodeURIComponent(cat.slug)}`)}
        >
          <img src={cat.image} alt={cat.name} className="w-16 h-16 mx-auto object-cover" />
          <h3 className="mt-2 font-semibold text-sm">{cat.name}</h3>
          <p className="text-xs text-gray-500">{cat.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;
