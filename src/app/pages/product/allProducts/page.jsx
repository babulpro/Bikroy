// src/app/pages/product/allProducts/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import ActiveFilters from '@/components/common/pagesComponent/product/component/ActiveFilters';
import ProductFilters from '@/components/common/pagesComponent/product/component/Filters';
import LoadingSpinner from '@/components/common/pagesComponent/product/component/Loading';
import Pagination from '@/components/common/pagesComponent/product/component/Pagination';
import ProductSearchBar from '@/components/common/pagesComponent/product/component/SearchBar';
import { useCategories } from '@/components/common/pagesComponent/product/hooks/UseCategory';
import { useLocationData } from '@/components/common/pagesComponent/product/hooks/UseLocation';
import { useProducts } from '@/components/common/pagesComponent/product/hooks/UseProduct';
import ProductCard from '@/components/common/pagesComponent/product/component/ProductCard';

export default function AllProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'newest',
    division: '',
    district: '',
    thana: '',
  });

  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);

  const { products, loading, pagination, fetchProducts, setPagination } = useProducts();
  const { categories } = useCategories();
  const { getDistricts, getThanas, getAllDivisions } = useLocationData();

  // Memoize these handlers to prevent unnecessary re-renders
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [setPagination]);

  const resetFilters = useCallback(() => {
    setFilters({
      categoryId: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: 'newest',
      division: '',
      district: '',
      thana: '',
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [setPagination]);

  // Update districts when division changes
  useEffect(() => {
    if (filters.division) {
      const newDistricts = getDistricts(filters.division);
      setDistricts(newDistricts);
      setFilters(prev => ({ ...prev, district: '', thana: '' }));
      setThanas([]);
    } else {
      setDistricts([]);
      setThanas([]);
    }
  }, [filters.division, getDistricts]); // getDistricts is now stable

  // Update thanas when district changes
  useEffect(() => {
    if (filters.district) {
      const newThanas = getThanas(filters.district);
      setThanas(newThanas);
      setFilters(prev => ({ ...prev, thana: '' }));
    } else {
      setThanas([]);
    }
  }, [filters.district, getThanas]); // getThanas is now stable

  // Fetch products when filters or page changes
  useEffect(() => {
    fetchProducts(filters, pagination.currentPage);
  }, [filters, pagination.currentPage, fetchProducts]);

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

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <ProductSearchBar
          search={filters.search}
          onSearchChange={(value) => handleFilterChange('search', value)}
          sortBy={filters.sortBy}
          onSortChange={(value) => handleFilterChange('sortBy', value)}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <ActiveFilters
          filters={filters}
          categories={categories}
          divisions={getAllDivisions()}
          onRemoveFilter={(key) => handleFilterChange(key, '')}
          onClearAll={resetFilters}
        />

        {showFilters && (
          <ProductFilters
            filters={filters}
            categories={categories}
            divisions={getAllDivisions()}
            districts={districts}
            thanas={thanas}
            onFilterChange={handleFilterChange}
          />
        )}

        <div className="flex-1">
          <div className="mb-3 text-xs text-gray-500">
            {products.length} of {pagination.totalProducts} products
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <div className="mb-3 text-5xl">🔍</div>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">No Products Found</h3>
              <p className="text-sm text-gray-600">Try adjusting your filters or search terms</p>
              <button onClick={resetFilters} className="px-4 py-1.5 mt-3 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    getProductImage={getProductImage}
                    getConditionLabel={getConditionLabel}
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}