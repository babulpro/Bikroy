 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Browse Categories</h1>
          <p className="mt-2 text-gray-600">Find what you're looking for by exploring our categories</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No Categories Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try a different search term' : 'No categories available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-3 ">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/pages/product/categories/${category.id}`}
                className="group"
              >
                <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1">
                  <div className="p-6 text-center">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 transition-colors bg-blue-100 rounded-full group-hover:bg-blue-200">
                      <span className="text-4xl">
                        {category.icon || '📁'}
                      </span>
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="mb-2 text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                      {category.name}
                    </h3>
                    
                    {/* Description
                    {category.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {category.description}
                      </p>
                    )} */}
                    
                    {/* Product Count */}
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {category.productCount || 0} products
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredCategories.length > 0 && (
          <div className="mt-8 text-sm text-center text-gray-500">
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        )}
      </div>
    </div>
  );
}