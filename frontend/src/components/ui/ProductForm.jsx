import React, { useState, useEffect } from 'react';

const ProductForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow border border-gray-200">
      <div>
        <label className="block font-semibold mb-1">Product Name</label>
        <input name="name" value={formData.name} onChange={handleChange}
               className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Price (₹)</label>
        <input name="price" type="number" value={formData.price} onChange={handleChange}
               className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Category</label>
        <input name="category" value={formData.category} onChange={handleChange}
               className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange}
                  className="w-full border rounded px-3 py-2" rows="3" required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Stock</label>
        <input name="stock" type="number" value={formData.stock} onChange={handleChange}
               className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
  <label className="block font-semibold mb-1">Product Image</label>
  
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="mb-2"
  />
  
  <div className="text-sm text-gray-500 mb-1">OR enter Image URL</div>
  <input
    type="text"
    name="image"
    value={typeof formData.image === 'string' ? formData.image : ''}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2"
    placeholder="https://example.com/image.jpg"
  />
</div>


      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {initialData._id ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
