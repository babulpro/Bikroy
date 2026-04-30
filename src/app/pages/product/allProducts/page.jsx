// src/app/pages/product/allProducts/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AllProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12
  });
  const [filters, setFilters] = useState({
    categoryId: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sort') || 'newest'
  });
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters, pagination.currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category/getCategory');
      const data = await response.json();
      if (data.status === 'success') {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy
      });

      const response = await fetch(`/api/product/all-products?${queryParams}`);
      const data = await response.json();

      if (data.status === 'success') {
        setProducts(data.products);
        setPagination({
          currentPage: data.pagination.page,
          totalPages: data.pagination.totalPages,
          totalProducts: data.pagination.total,
          limit: data.pagination.limit
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      categoryId: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: 'newest'
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const getProductImage = (product) => {
    return product.image1 || product.image2 || product.image3 || product.image4 || product.image5 || '/placeholder-image.jpg';
  };

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
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">All Products</h1>
          <p className="mt-2 text-gray-600">Discover amazing products from our sellers</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-3 pl-12 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filters Sidebar */}
          <div className="lg:w-72">
            <div className="sticky p-5 bg-white rounded-lg shadow-lg top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Conditions</option>
                  <option value="NEW">🆕 New</option>
                  <option value="LIKE_NEW">✨ Like New</option>
                  <option value="GOOD">👍 Good</option>
                  <option value="FAIR">👌 Fair</option>
                  <option value="POOR">⚠️ Poor</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {products.length} of {pagination.totalProducts} products
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-lg shadow-lg">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No Products Found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} getProductImage={getProductImage} getConditionLabel={getConditionLabel} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 text-gray-600 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg transition-colors ${
                              pagination.currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="flex items-center gap-1 px-4 py-2 text-gray-600 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, getProductImage, getConditionLabel }) {
  return (
    <Link href={`/pages/product/${product.id}`} className="group">
      <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1">
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
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 transition-colors line-clamp-1 group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-bold text-blue-600">
              ৳{product.price.toLocaleString()}
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