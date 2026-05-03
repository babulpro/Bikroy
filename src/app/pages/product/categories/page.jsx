// src/app/pages/product/categories/page.jsx
'use client';

import AllCategories from '@/components/common/pagesComponent/category/AllCategories';
import CategoryStats from '@/components/common/pagesComponent/category/CategoryStarts';
import FeaturedCategories from '@/components/common/pagesComponent/category/FeaturedCategories';
import CategoryHero from '@/components/common/pagesComponent/category/Hero';
import SearchResults from '@/components/common/pagesComponent/category/SearchResult';
import LoadingSpinner from '@/components/common/pagesComponent/product/component/Loading';
import { useState, useEffect } from 'react';
 

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const featuredCategories = filteredCategories.slice(0, 8);
  const allCategories = filteredCategories.slice(8);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <CategoryHero 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm('')}
      />

      <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
        {searchTerm ? (
          <SearchResults 
            searchTerm={searchTerm}
            categories={filteredCategories}
            onClearSearch={() => setSearchTerm('')}
          />
        ) : (
          <>
            <FeaturedCategories categories={featuredCategories} />
            <AllCategories categories={allCategories} />
            {filteredCategories.length > 0 && (
              <div className="mt-8 text-sm text-center text-gray-500">
                Showing {filteredCategories.length} of {categories.length} categories
              </div>
            )}
            <CategoryStats categories={categories} />
          </>
        )}
      </div>
    </div>
  );
}