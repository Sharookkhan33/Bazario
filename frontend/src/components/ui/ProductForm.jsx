import React, { useState, useEffect } from 'react';

const ProductForm = ({ initialData = {}, onSubmit, mode = "add" }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    discount: '',
    isFeatured: false,
    tags: '',
    image: '',
  });

  // ✅ Update only once when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['price', 'stock'].includes(name) ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Product Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Price (₹)</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Category</label>
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          rows="4"
          required
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Stock</label>
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Discount */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Discount (%)</label>
        <input
          name="discount"
          type="number"
          value={formData.discount}
          onChange={handleChange}
          className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Featured */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Featured Product</label>
        <input
          type="checkbox"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
          className="mt-1"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Tags</label>
        <input
          name="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",") })}
          className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Trending, Hot, Limited Edition"
        />
        <p className="text-sm text-gray-500">Enter tags separated by commas</p>
      </div>

      {/* Product Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mt-1 mb-2 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="text-sm text-gray-500 mb-1">OR enter Image URL</div>
        <input
          name="image"
          type="text"
          value={typeof formData.image === 'string' ? formData.image : ''}
          onChange={handleChange}
          className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
      >
        {mode === 'edit' ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
