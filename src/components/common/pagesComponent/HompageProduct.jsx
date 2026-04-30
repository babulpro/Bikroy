// src/components/home/FeaturedProducts.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FeaturedProducts({ limit = 8, title = "Featured Products", subtitle = "Handpicked products just for you" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

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

  const getProductImage = (product) => {
    return product.image1 || product.image2 || product.image3 || product.image4 || product.image5 || '/placeholder-image.jpg';
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
    <div className='container m-auto'>
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
          <ProductCard key={product.id} product={product} getProductImage={getProductImage} />
        ))}
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, getProductImage }) {
  const getConditionLabel = (condition) => {
    const conditions = {
      NEW: 'New',
      LIKE_NEW: 'Like New',
      GOOD: 'Good',
      FAIR: 'Fair',
      POOR: 'Poor'
    };
    return conditions[condition] || condition;
  };

  return (
    <Link href={`/pages/product/productById/${product.id}`} className="group">
      <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {product.isFeatured && (
            <span className="absolute px-2 py-1 text-xs font-semibold text-blue-700 bg-yellow-400 rounded top-2 right-2">
              Featured
            </span>
          )}
          {product.condition && (
            <span className="absolute px-2 py-1 text-xs text-white bg-blue-600 rounded top-2 left-2">
              {getConditionLabel(product.condition)}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 transition-colors line-clamp-1 group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-bold text-blue-600">
              {product.currency === 'BDT' ? '৳' : product.currency === 'USD' ? '$' : '€'}
              {product.price.toLocaleString()}
            </p>
            <div className="flex items-center text-xs text-gray-400">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {product.viewCount || 0}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}