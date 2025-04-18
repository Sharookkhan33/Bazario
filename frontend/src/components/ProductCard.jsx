import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="border p-4 rounded-lg">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover"/>
      <h3 className="text-lg font-bold">{product.name}</h3>
      <p>₹{product.price}</p>
      <button className="bg-blue-500 text-white py-2 px-4 rounded">Add to Cart</button>
    </div>
  );
}

export default ProductCard;
