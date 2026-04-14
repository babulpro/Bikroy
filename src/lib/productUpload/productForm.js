// components/ProductForm.jsx
'use client';

import { useState, useEffect } from 'react';
import ProductImageManager from './ProductImageManager';

export default function ProductForm({ productId, initialData = null }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'BDT',
    condition: 'NEW',
    contactPhone: '',
    contactEmail: '',
    type: '',
    categoryId: '',
    images: []
  });
  const [errors, setErrors] = useState({});

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category/getCategory');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (!formData.contactPhone) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Invalid phone number';
    }
    
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email address';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const url = productId ? `/api/product/allProduct/newProduct/${productId}` : '/api/product';
      const method = productId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect or show success message
        window.location.href = `/products/${data.data.id}`;
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">
        {productId ? 'Edit Product' : 'Create New Product'}
      </h2>
      
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
        
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
            placeholder="Describe your product in detail..."
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          <p className="text-gray-500 text-sm mt-1">
            {formData.description.length}/5000 characters
          </p>
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
        </div>
      </div>
      
      {/* Pricing & Condition */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Pricing & Condition</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="p-2 border border-r-0 rounded-l-lg bg-gray-50"
              >
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className={`flex-1 p-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          {/* Condition */}
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="NEW">New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
            </select>
          </div>
        </div>
        
        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="e.g., Electronics, Furniture, Clothing"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="+880 1XXX XXXXXX"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.contactPhone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email (Optional)</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="contact@example.com"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.contactEmail ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
          </div>
        </div>
      </div>
      
      {/* Images Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Product Images</h3>
        <ProductImageManager
          productId={productId}
          existingImages={formData.images}
          onImagesChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
        />
      </div>
      
      {/* Featured & Boost Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Promotion Options</h3>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-500"
            />
            <span>Feature this product (appears on homepage)</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isBoosted"
              checked={formData.isBoosted}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-500"
            />
            <span>Boost this product (higher visibility in search results)</span>
          </label>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : (productId ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}