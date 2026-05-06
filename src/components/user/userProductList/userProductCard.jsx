// src/app/pages/user/myProducts/ProductCard.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link'; 
import UserActionButtons from './ActionButton';

export default function UserProductCard({ product, onStatusChange, onDelete, onShowMessage }) {
  const [updating, setUpdating] = useState(false);

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

  const getProductImage = () => {
    return product.image1 || product.image2 || product.image3 || product.image4 || product.image5 || '/placeholder-image.jpg';
  };

  const statusBadge = getStatusBadge(product.status);

  const handleStatusToggle = async () => {
    const newStatus = product.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';
    
    if (!confirm(`Are you sure you want to ${action} this product?`)) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/product/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product.id, status: newStatus })
      });
      const data = await response.json();
      if (data.status === 'success') {
        onStatusChange(product.id, newStatus);
        onShowMessage('success', `Product ${action}d successfully!`);
      } else {
        onShowMessage('error', data.msg || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      onShowMessage('error', 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/product/delete-product`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product.id })
      });
      const data = await response.json();
      if (data.status === 'success') {
        onDelete(product.id);
        onShowMessage('success', 'Product deleted successfully!');
      } else {
        onShowMessage('error', data.msg || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      onShowMessage('error', 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-100 md:w-48">
          <img
            src={getProductImage()}
            alt={product.name}
            className="object-cover w-full h-full"
            loading="lazy"
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
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
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

          <UserActionButtons
            productId={product.id}
            status={product.status}
            onStatusToggle={handleStatusToggle}
            onDelete={handleDelete}
            updating={updating}
          />
        </div>
      </div>
    </div>
  );
}