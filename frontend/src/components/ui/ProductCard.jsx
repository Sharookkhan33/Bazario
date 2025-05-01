import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const rating = product.averageRating || 4.1;
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`text-yellow-500 ${i + 1 > Math.round(rating) ? 'text-gray-300' : ''}`}>★</span>
  ));

  const discountedPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : null;

  const getTag = () => {
    if (product.tags?.includes('Trending')) return 'Trending';
    if (product.tags?.includes('Hot')) return 'Hot';
    if (product.tags?.includes('Limited Edition')) return 'Limited Edition';
    if (product.isFeatured) return 'Featured';
    return null;
  };

  const tag = getTag();

  return (
    <div
  onClick={() => navigate(`/product/${product._id}`)}
  className="group relative w-full max-w-[240px] sm:max-w-[260px] md:max-w-[270px] h-[340px] sm:h-[380px] md:h-[400px] bg-white rounded-lg shadow hover:shadow-lg overflow-visible cursor-pointer transform transition-transform duration-300 hover:scale-105 mx-auto"
>
      {tag && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full z-10">
          {tag}
        </div>
      )}

      <div className="relative w-full pb-[100%] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-2 sm:p-3">
        <h3 className="font-sans font-semibold text-gray-900 text-sm sm:text-base truncate">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mt-1">
          {discountedPrice ? (
            <>
              <p className="text-gray-400 line-through text-xs">₹{product.price}</p>
              <p className="text-indigo-600 font-bold text-base sm:text-lg">₹{discountedPrice}</p>
              <p className="text-green-600 text-xs font-semibold">{product.discount}% OFF</p>
            </>
          ) : (
            <p className="text-indigo-600 font-bold text-base sm:text-lg">₹{product.price}</p>
          )}
        </div>

        <div className="mt-1 flex items-center space-x-1">
          {stars}
          <span className="text-gray-600 text-xs">{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-white p-4 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex flex-col justify-center items-center text-center">
        <h3 className="font-sans font-bold text-base sm:text-lg mb-2">{product.name}</h3>
        <p className="text-gray-700 text-sm line-clamp-3 mb-3">{product.description}</p>

        <div className="flex items-center space-x-2 mb-2">
          {discountedPrice ? (
            <>
              <p className="text-gray-400 line-through text-sm">₹{product.price}</p>
              <p className="text-indigo-600 font-bold text-lg sm:text-xl">₹{discountedPrice}</p>
              <p className="text-green-600 text-xs font-semibold">{product.discount}% OFF</p>
            </>
          ) : (
            <p className="text-indigo-600 font-bold text-lg sm:text-xl">₹{product.price}</p>
          )}
        </div>

        <div className="flex items-center justify-center">
          {stars}
          <span className="text-gray-600 ml-1">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
