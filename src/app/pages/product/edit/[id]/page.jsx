// src/app/pages/product/edit/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    isBoosted: false,
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch categories and product data
  useEffect(() => {
    if (id) {
      fetchCategories();
      fetchProduct();
    }
  }, [id]);

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

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product/allProduct/productById?productId=${id}`);
      const data = await response.json();

      if (data.success) {
        const product = data.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          currency: product.currency || 'BDT',
          condition: product.condition || 'NEW',
          contactPhone: product.contactPhone || '',
          contactEmail: product.contactEmail || '',
          type: product.type || '',
          categoryId: product.categoryId || '',
          image1: product.image1 || '',
          image2: product.image2 || '',
          image3: product.image3 || '',
          image4: product.image4 || '',
          image5: product.image5 || '',
          isFeatured: product.isFeatured || false,
          isBoosted: product.isBoosted || false,
          status: product.status || 'ACTIVE'
        });
      } else {
        showMessage('error', 'Product not found');
        setTimeout(() => router.push('/pages/product/my-products'), 2000);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showMessage('error', 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

    setSubmitting(true);

    try {
      const response = await fetch(`/api/product/update-product`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: id,
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        showMessage('success', 'Product updated successfully!');
        setTimeout(() => {
          router.push(`/pages/product/productById/${id}`);
        }, 1500);
      } else {
        showMessage('error', data.msg || 'Failed to update product');
      }
    } catch (error) {
      console.error('Update error:', error);
      showMessage('error', 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const getImageFields = () => {
    return [1, 2, 3, 4, 5].map(num => ({
      field: `image${num}`,
      label: `Image ${num}`,
      currentImage: formData[`image${num}`]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
              <p className="mt-2 text-gray-600">Update your product information</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

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
                  className={`w-full px-4 py-2 text-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                    className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
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
                      className="px-3 py-2 border border-r-0 rounded-l-lg text-slate-700 bg-gray-50 focus:outline-none"
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
                      className={`flex-1 px-4 text-slate-700 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Product Images
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
                      productId={id}
                      imageNumber={field}
                      currentImage={currentImage}
                      onUploadComplete={handleImageUpload}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div> */}

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
                    className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Status */}
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Product Status</h2>
            </div>
            <div className="p-6">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">🟢 Active - Visible to buyers</option>
                <option value="HIDDEN">🔴 Hidden - Not visible to buyers</option>
                <option value="SOLD">💰 Sold - Mark as sold</option>
              </select>
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
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">⭐ Feature this product (appears on homepage)</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBoosted"
                  checked={formData.isBoosted}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
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
              className="px-6 py-2 transition-colors border border-gray-300 rounded-lg bg-amber-500 hover:bg-amber-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center px-6 py-2 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}