// src/app/pages/product/myproducts/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MyProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await fetch('/api/product/allProduct/myProduct', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setProducts(data.products || []);
      } else if (data.status === 'fail' && data.msg === 'Unauthorized') {
        router.push('/pages/user/login');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showMessage('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleStatusToggle = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';
    
    if (!confirm(`Are you sure you want to ${action} this product?`)) {
      return;
    }

    setUpdating(productId);

    try {
      const response = await fetch(`/api/product/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setProducts(products.map(product => 
          product.id === productId 
            ? { ...product, status: newStatus }
            : product
        ));
        showMessage('success', `Product ${action}d successfully!`);
      } else {
        showMessage('error', data.msg || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showMessage('error', 'Something went wrong');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    setUpdating(productId);

    try {
      const response = await fetch(`/api/product/delete-product`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setProducts(products.filter(product => product.id !== productId));
        showMessage('success', 'Product deleted successfully!');
      } else {
        showMessage('error', data.msg || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showMessage('error', 'Something went wrong');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'Active', color: 'bg-green-100 text-green-800' };
      case 'HIDDEN':
        return { label: 'Hidden', color: 'bg-gray-100 text-gray-800' };
      case 'SOLD':
        return { label: 'Sold', color: 'bg-blue-100 text-blue-800' };
      case 'EXPIRED':
        return { label: 'Expired', color: 'bg-red-100 text-red-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getProductImage = (product) => {
    return product.image1 || product.image2 || product.image3 || product.image4 || product.image5 || '/placeholder-image.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
              <p className="mt-2 text-gray-600">Manage your listed products</p>
            </div>
            <Link
              href="/pages/product/item/addProduct"
              className="flex items-center px-5 py-2 mt-4 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg sm:mt-0 hover:bg-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Product</span>
            </Link>
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

        {/* Products List */}
        {products.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-6xl">📦</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No Products Yet</h3>
            <p className="mb-6 text-gray-600">Start selling by adding your first product</p>
            <Link
              href="/pages/product/item/addProduct"
              className="inline-flex items-center px-6 py-2 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const statusBadge = getStatusBadge(product.status);
              const isUpdating = updating === product.id;
              
              return (
                <div key={product.id} className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
                  <div className="flex flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100 md:w-48">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <Link href={`/pages/product/productById/${product.id}`}>
                            <h3 className="text-lg font-semibold text-gray-800 transition-colors hover:text-blue-600">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <div className="mt-2 text-right sm:mt-0 sm:ml-4">
                          <p className="text-xl font-bold text-blue-600">
                            {product.currency === 'BDT' ? '৳' : '$'}{product.price.toLocaleString()}
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {product.viewCount || 0} views
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(product.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center capitalize">
                          Condition: {product.condition?.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Link
                          href={`/pages/product/edit/${product.id}`}
                          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => handleStatusToggle(product.id, product.status)}
                          disabled={isUpdating}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center space-x-1 ${
                            product.status === 'ACTIVE'
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {isUpdating ? (
                            <div className="w-4 h-4 border-b-2 border-current rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{product.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={isUpdating}
                          className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>

                        <Link
                          href={`/pages/product/${product.id}`}
                          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}