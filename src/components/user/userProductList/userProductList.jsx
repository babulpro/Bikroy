// src/app/pages/user/myProducts/ProductList.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import UserProductCard from './userProductCard';

export default function UserProductList() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const updateProductStatus = (productId, newStatus) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, status: newStatus } : product
    ));
  };

  const removeProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-lg shadow-lg">
        <div className="mb-4 text-6xl">📦</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">No Products Yet</h3>
        <p className="mb-6 text-gray-600">Start selling by adding your first product</p>
        <a
          href="/pages/product/item/addProduct"
          className="inline-flex items-center px-6 py-2 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Your First Product</span>
        </a>
      </div>
    );
  }

  return (
    <>
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <UserProductCard
            key={product.id}
            product={product}
            onStatusChange={updateProductStatus}
            onDelete={removeProduct}
            onShowMessage={showMessage}
          />
        ))}
      </div>
    </>
  );
}