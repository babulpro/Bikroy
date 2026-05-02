// src/app/pages/product/allProducts/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Bangladesh Location Data
const BANGLADESH_DIVISIONS = [
  { id: "dhaka", name: "Dhaka" },
  { id: "chittagong", name: "Chittagong" },
  { id: "rajshahi", name: "Rajshahi" },
  { id: "khulna", name: "Khulna" },
  { id: "barisal", name: "Barisal" },
  { id: "sylhet", name: "Sylhet" },
  { id: "rangpur", name: "Rangpur" },
  { id: "mymensingh", name: "Mymensingh" }
];

const BANGLADESH_DISTRICTS = {
  dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Kishoreganj", "Manikganj", "Munshiganj", "Narsingdi", "Faridpur", "Rajbari", "Shariatpur", "Madaripur", "Gopalganj"],
  chittagong: ["Chittagong", "Cox's Bazar", "Comilla", "Brahmanbaria", "Rangamati", "Khagrachari", "Bandarban", "Feni", "Lakshmipur", "Noakhali", "Chandpur"],
  rajshahi: ["Rajshahi", "Bogra", "Chapainawabganj", "Naogaon", "Natore", "Pabna", "Sirajganj", "Joypurhat"],
  khulna: ["Khulna", "Jessore", "Kushtia", "Chuadanga", "Jhenaidah", "Magura", "Narail", "Bagerhat", "Satkhira"],
  barisal: ["Barisal", "Barguna", "Patuakhali", "Bhola", "Jhalokati", "Pirojpur"],
  sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  rangpur: ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon"],
  mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"]
};

const BANGLADESH_THANAS = {
  "Dhaka": ["Gulshan", "Banani", "Uttara", "Dhanmondi", "Mohammadpur", "Mirpur", "Motijheel", "Paltan", "Ramna", "Shahbag", "Tejgaon", "Khilgaon", "Sabujbagh", "Kafrul", "Cantonment", "Badda", "Rampura"],
  "Gazipur": ["Gazipur Sadar", "Tongi", "Kaliakoir", "Kaliganj", "Kapasia", "Sreepur"],
  "Narayanganj": ["Narayanganj Sadar", "Bandar", "Rupganj", "Sonargaon", "Araihazar"],
  "Chittagong": ["Chittagong Sadar", "Panchlaish", "Double Mooring", "Kotwali", "Pahartali", "Halishahar", "Baizid Bostami", "Khulshi"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Ramu", "Ukhia", "Teknaf", "Chakaria", "Pekua"],
  "Rajshahi": ["Rajshahi Sadar", "Boalia", "Motihar", "Shah Makhdum", "Paba", "Godagari"],
  "Khulna": ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali", "Harintana"],
  "Barisal": ["Barisal Sadar", "Kawnia", "Bandar", "Gournadi", "Agailjhara"],
  "Sylhet": ["Sylhet Sadar", "Mogla Bazar", "Shah Poran", "Jalalabad", "South Surma"],
  "Rangpur": ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur"],
  "Mymensingh": ["Mymensingh Sadar", "Kotwali", "Ganginarpar", "Trishal", "Muktagacha"]
};

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  });

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

  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category/getCategory');
        const data = await res.json();
        if (data.status === 'success') {
          setCategories(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Update districts when division changes
  useEffect(() => {
    if (filters.division) {
      setDistricts(BANGLADESH_DISTRICTS[filters.division] || []);
      setFilters(prev => ({ ...prev, district: '', thana: '' }));
      setThanas([]);
    } else {
      setDistricts([]);
      setThanas([]);
    }
  }, [filters.division]);

  // Update thanas when district changes
  useEffect(() => {
    if (filters.district) {
      setThanas(BANGLADESH_THANAS[filters.district] || []);
      setFilters(prev => ({ ...prev, thana: '' }));
    } else {
      setThanas([]);
    }
  }, [filters.district]);

  // Define fetchProducts function with useCallback
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.search && { search: filters.search }),
        ...(filters.division && { division: filters.division }),
        ...(filters.district && { district: filters.district }),
        ...(filters.thana && { thana: filters.thana }),
      });

      const res = await fetch(`/api/product/all-products?${queryParams}`);
      const data = await res.json();

      if (data.status === 'success') {
        setProducts(data.products || []);
        setPagination({
          currentPage: data.pagination?.page || 1,
          totalPages: data.pagination?.totalPages || 1,
          totalProducts: data.pagination?.total || 0,
          limit: data.pagination?.limit || 12,
        });
      } else {
        console.error('API returned error:', data.msg);
        setProducts([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage]);

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      sortBy: 'newest',
      division: '',
      district: '',
      thana: '',
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
        {/* Search and Sort Bar - Combined */}
        <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {filters.search && (
              <button
                onClick={() => handleFilterChange('search', '')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              {showFilters ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* Reset Filters Button */}
            {(filters.categoryId || filters.condition || filters.division || filters.district || filters.thana || filters.minPrice || filters.maxPrice) && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Tags */}
        {(filters.categoryId || filters.condition || filters.division || filters.district || filters.thana || filters.minPrice || filters.maxPrice) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.categoryId && categories.find(c => c.id === filters.categoryId) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                {categories.find(c => c.id === filters.categoryId).name}
                <button onClick={() => handleFilterChange('categoryId', '')} className="hover:text-blue-900">×</button>
              </span>
            )}
            {filters.condition && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                {filters.condition}
                <button onClick={() => handleFilterChange('condition', '')} className="hover:text-blue-900">×</button>
              </span>
            )}
            {filters.division && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                {BANGLADESH_DIVISIONS.find(d => d.id === filters.division)?.name}
                <button onClick={() => handleFilterChange('division', '')} className="hover:text-blue-900">×</button>
              </span>
            )}
            {filters.district && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                {filters.district}
                <button onClick={() => handleFilterChange('district', '')} className="hover:text-blue-900">×</button>
              </span>
            )}
            {filters.thana && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                {filters.thana}
                <button onClick={() => handleFilterChange('thana', '')} className="hover:text-blue-900">×</button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                ৳{filters.minPrice || 0} - ৳{filters.maxPrice || '∞'}
                <button onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }} className="hover:text-blue-900">×</button>
              </span>
            )}
          </div>
        )}

        {/* Filters Sidebar - Collapsible */}
        {showFilters && (
          <div className="p-4 mb-5 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Category Filter */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Category</label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Conditions</option>
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="POOR">Poor</option>
                </select>
              </div>

              {/* Division Filter */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Division</label>
                <select
                  value={filters.division}
                  onChange={(e) => handleFilterChange('division', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Divisions</option>
                  {BANGLADESH_DIVISIONS.map(div => (
                    <option key={div.id} value={div.id}>{div.name}</option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">District</label>
                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  disabled={!filters.division}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Thana Filter */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Thana/Area</label>
                <select
                  value={filters.thana}
                  onChange={(e) => handleFilterChange('thana', e.target.value)}
                  disabled={!filters.district}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">All Areas</option>
                  {thanas.map(thana => (
                    <option key={thana} value={thana}>{thana}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Price Range</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 px-2 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 px-2 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Info */}
          <div className="mb-3 text-xs text-gray-500">
            {products.length} of {pagination.totalProducts} products
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-10 h-10 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <div className="mb-3 text-5xl">🔍</div>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">No Products Found</h3>
              <p className="text-sm text-gray-600">Try adjusting your filters or search terms</p>
              <button
                onClick={resetFilters}
                className="px-4 py-1.5 mt-3 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => {
                  const conditionBadge = getConditionLabel(product.condition);
                  return (
                    <Link key={product.id} href={`/pages/product/productById/${product.id}`} className="group">
                      <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1">
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                          {product.isFeatured && (
                            <span className="absolute px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 bg-yellow-400 rounded top-1 right-1">
                              Featured
                            </span>
                          )}
                          {product.condition && (
                            <span className={`absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded ${conditionBadge.color}`}>
                              {conditionBadge.label}
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-semibold text-gray-800 transition-colors line-clamp-1 group-hover:text-blue-600">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-base font-bold text-blue-600">
                              {product.currency === 'BDT' ? '৳' : '$'}{product.price.toLocaleString()}
                            </p>
                            <div className="flex items-center text-xs text-gray-400">
                              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {product.viewCount || 0}
                            </div>
                          </div>
                          {(product.division || product.district) && (
                            <div className="flex items-center mt-1 text-[10px] text-gray-400">
                              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span>{product.district}{product.thana && `, ${product.thana}`}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                          className={`w-8 h-8 text-sm rounded-lg transition-colors ${
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
                    className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}