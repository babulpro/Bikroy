// src/app/pages/product/item/addProduct/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default function UploadPage() {
  const router = useRouter();
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
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
    isFeatured: false,
    isBoosted: false
  });
  const [errors, setErrors] = useState({});

  // Fetch categories on load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category/getCategory');
      const data = await response.json();
      if (data.status === 'success') {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
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

  const handleImageUpload = (imageField, imageUrl) => {
    setFormData(prev => ({
      ...prev,
      [imageField]: imageUrl
    }));
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
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/product/allProduct/newProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // router.push(`/pages/product/${data.data.id}?success=true`);
        router.push(`/`);
      } else {
        alert(data.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getImageFields = () => {
    return [1, 2, 3, 4, 5].map(num => ({
      field: `image${num}`,
      label: `Image ${num}`,
      currentImage: formData[`image${num}`]
    }));
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Sell Your Product</h1>
          <p className="mt-2 text-gray-600">List your item and reach millions of buyers</p>
        </div>

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Basic Information</h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Product Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., iPhone 14 Pro, Sony Headphones"
                  className={`w-full px-4 text-slate-600 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={`w-full px-4 text-slate-600 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.categoryId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Product Type (Optional)</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="e.g., Mobile, Laptop, Furniture"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product in detail... (minimum 20 characters)"
                  className={`w-full px-4 text-slate-600 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/5000 characters
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Condition */}
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Pricing & Condition</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-r-0 rounded-l-lg text-slate-600 bg-gray-50 focus:outline-none"
                    >
                      <option value="BDT">৳ BDT</option>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                    </select>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      className={`flex-1 px-4 text-slate-600 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NEW">🆕 New</option>
                    <option value="LIKE_NEW">✨ Like New</option>
                    <option value="GOOD">👍 Good</option>
                    <option value="FAIR">👌 Fair</option>
                    <option value="POOR">⚠️ Poor</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Product Images</h2>
              <p className="mt-1 text-sm text-blue-100">Upload up to 5 images (First image will be primary)</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {getImageFields().map(({ field, label, currentImage }) => (
                  <div key={field}>
                    <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
                    <ImageUpload
                      productId={null}
                      imageNumber={field}
                      currentImage={currentImage}
                      onUploadComplete={handleImageUpload}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Contact Information</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+880 1XXX XXXXXX"
                    className={`w-full px-4 text-slate-600 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.contactPhone && <p className="mt-1 text-sm text-red-500">{errors.contactPhone}</p>}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email (Optional)</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Options */}
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Promotion Options</h2>
            </div>
            <div className="p-6 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded text-slate-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">⭐ Feature this product (appears on homepage)</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBoosted"
                  checked={formData.isBoosted}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded text-slate-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">🚀 Boost this product (higher visibility in search)</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating Product...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>List Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}