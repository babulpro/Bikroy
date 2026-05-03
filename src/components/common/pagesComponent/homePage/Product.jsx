// src/components/home/FeaturedProducts.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import ProductCard from '../product/component/ProductCard';
 

export default function FeaturedProducts({ limit = 8, title = "Featured Products", subtitle = "Handpicked products just for you" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add these helper functions
  const getProductImage = (product) => {
    return product.image1 || product.image2 || product.image3 || product.image4 || product.image5 || '/placeholder-image.jpg';
  };

  const getConditionLabel = (condition) => {
    const conditions = {
      NEW: { label: 'New', color: 'bg-green-100 text-green-800' },
      LIKE_NEW: { label: 'Like New', color: 'bg-blue-100 text-blue-800' },
      GOOD: { label: 'Good', color: 'bg-yellow-100 text-yellow-800' },
      FAIR: { label: 'Fair', color: 'bg-orange-100 text-orange-800' },
      POOR: { label: 'Poor', color: 'bg-red-100 text-red-800' }
    };
    return conditions[condition] || { label: condition, color: 'bg-gray-100 text-gray-800' };
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, [limit]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`/api/product/allProduct/featured-products?limit=${limit}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setProducts(data.products || []);
      } else {
        setError(data.msg || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">{title}</h2>
            <p className="mt-1 text-gray-600">{subtitle}</p>
          </div>
          <Link 
            href="/pages/product/allProducts" 
            className="flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              getProductImage={getProductImage}
              getConditionLabel={getConditionLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}