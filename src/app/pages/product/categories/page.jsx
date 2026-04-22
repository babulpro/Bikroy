'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories on load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/category/getCategory');
      const data = await response.json();

      if (data.status === 'success') {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group categories for featured section (first 8 categories)
  const featuredCategories = filteredCategories.slice(0, 8);
  const allCategories = filteredCategories.slice(8);

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Hero Section */}
      <div className="py-16 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">Browse Categories</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-90">
            Find exactly what you're looking for by exploring our wide range of categories
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 text-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
        {/* Featured Categories Section */}
        {featuredCategories.length > 0 && !searchTerm && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Popular Categories</h2>
              <Link href="/pages/product/products" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View All Products →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/pages/product/categories/${category.id}`}
                  className="group"
                >
                  <div className="overflow-hidden transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl hover:-translate-y-1">
                    <div className="p-5 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 transition-all bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:from-blue-200 group-hover:to-blue-300">
                        <span className="text-3xl">
                          {category.icon || '📁'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        {category.productCount || 0} items
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Categories Section */}
        {allCategories.length > 0 && !searchTerm && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">All Categories</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {allCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/pages/product/categories/${category.id}`}
                  className="group"
                >
                  <div className="transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200">
                    <div className="flex items-center p-4 space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-blue-50 group-hover:bg-blue-100">
                        <span className="text-xl">
                          {category.icon || '📁'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 transition-colors group-hover:text-blue-600">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {category.productCount || 0} products
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 transition-colors group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchTerm && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Search Results for "{searchTerm}"
              </h2>
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Clear Search
              </button>
            </div>
            
            {filteredCategories.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-lg shadow-lg">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No Categories Found</h3>
                <p className="text-gray-600">
                  We couldn't find any categories matching "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Browse All Categories
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/pages/product/categories/${category.id}`}
                    className="group"
                  >
                    <div className="transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200">
                      <div className="flex items-center p-4 space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-blue-50 group-hover:bg-blue-100">
                          <span className="text-xl">
                            {category.icon || '📁'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 transition-colors group-hover:text-blue-600">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {category.productCount || 0} products
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 transition-colors group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        {!searchTerm && filteredCategories.length > 0 && (
          <div className="mt-8 text-sm text-center text-gray-500">
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        )}

        {/* Category Stats Banner */}
        {!searchTerm && categories.length > 0 && (
          <div className="p-6 mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {categories.filter(cat => cat.icon).length}
                </div>
                <div className="text-sm text-gray-600">With Icons</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Customer Support</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}