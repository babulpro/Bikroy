// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FeaturedProducts from '@/components/common/pagesComponent/HompageProduct';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category/getCategory');
      const data = await response.json();
      if (data.status === 'success') {
        // Get top 8 categories
        const topCategories = data.data.slice(0, 8);
        setCategories(topCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            Buy & Sell Anything in Bangladesh
          </h1>
          <p className="mb-8 text-lg sm:text-xl md:text-2xl opacity-90">
            Join millions of buyers and sellers on Bikroy.com
          </p>
          <Link
            href="/pages/product/products"
            className="inline-block px-6 py-3 font-semibold text-blue-700 transition-colors bg-yellow-400 rounded-lg shadow-lg sm:px-8 hover:bg-yellow-300"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">Popular Categories</h2>
              <p className="mt-1 text-gray-600">Browse through our most popular categories</p>
            </div>
            <Link 
              href="/pages/product/categories" 
              className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/pages/product/categories/${category.id}`}
                  className="group"
                >
                  <div className="p-5 text-center transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1">
                    <div className="mb-2 text-4xl transition-transform transform group-hover:scale-110">
                      {category.icon || '📁'}
                    </div>
                    <h3 className="font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>











     
      <section>
        <FeaturedProducts />
      </section>




      {/* CTA Section */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Ready to Sell Your Products?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            List your products for free and reach millions of buyers
          </p>
          <Link
            href="/pages/product/sell"
            className="inline-block px-8 py-3 font-semibold text-blue-700 transition-colors bg-yellow-400 rounded-lg shadow-lg hover:bg-yellow-300"
          >
            Start Selling Now
          </Link>
        </div>
      </section>
    </div>
  );
}