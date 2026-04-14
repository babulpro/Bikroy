// src/app/pages/product/category/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CategoryProductsPage() {
  const params = useParams();
  const { id } = params;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filter states
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch category and products
  useEffect(() => {
    if (id) {
      fetchCategoryAndProducts();
    }
  }, [id]);

  // Apply filters and sorting
  useEffect(() => {
    if (products.length > 0) {
      applyFiltersAndSort();
    }
  }, [products, priceRange, selectedCondition, selectedType, sortBy]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products by category using your API
      const productsRes = await fetch(`/api/product/allProduct/productByCategory?categoryId=${id}`);
      const productsData = await productsRes.json();
      
      if (productsData.success) {
        // Your API returns data in productsData.data.products
        const productsList = productsData.data?.products || [];
        setProducts(productsList);
        setFilteredProducts(productsList);
        
        // Set category from the response
        if (productsData.data?.category) {
          setCategory(productsData.data.category);
        }
      } else {
        console.error('Failed to fetch products:', productsData.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));
    }

    // Filter by condition
    if (selectedCondition) {
      filtered = filtered.filter(p => p.condition === selectedCondition);
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(p => p.type?.toLowerCase() === selectedType.toLowerCase());
    }

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedCondition('');
    setSelectedType('');
    setSortBy('newest');
  };

  const getUniqueTypes = () => {
    const types = products.map(p => p.type).filter(t => t && t.trim());
    return [...new Set(types)];
  };

  const getProductImage = (product) => {
    // Get the first available image (image1, image2, etc.)
    return product.image1 || product.image2 || product.image3 || product.image4 || product.image5 || '/placeholder-image.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!category && products.length === 0) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-12 text-center bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Category Not Found</h3>
            <p className="text-gray-600">The category you're looking for doesn't exist.</p>
            <Link href="/" className="inline-block px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/pages/product/categories" className="hover:text-blue-600">Categories</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-800">{category?.name || 'Products'}</span>
        </div>

        {/* Category Header */}
        <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-4 bg-blue-100 rounded-full">
            <span className="text-5xl">{category?.icon || '📁'}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">{category?.name || 'Products'}</h1>
          {category?.description && (
            <p className="max-w-2xl mx-auto mt-2 text-gray-600">{category.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">{filteredProducts.length} products found</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <div className="flex-shrink-0 lg:w-72">
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

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="mb-3 font-medium text-gray-700">Price Range</h4>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-1/2 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-1/2 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h4 className="mb-3 font-medium text-gray-700">Condition</h4>
                <div className="space-y-2">
                  {['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'].map(condition => (
                    <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={selectedCondition === condition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {condition.toLowerCase().replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              {getUniqueTypes().length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 font-medium text-gray-700">Product Type</h4>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {getUniqueTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-white rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Products Display */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-lg shadow-lg">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No Products Found</h3>
                <p className="text-gray-600">Try adjusting your filters or browse other categories.</p>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} getProductImage={getProductImage} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductListItem key={product.id} product={product} getProductImage={getProductImage} />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component (Grid View)
function ProductCard({ product, getProductImage }) {
  return (
    <Link href={`/pages/product/${product.id}`} className="group">
      <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
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
              {product.condition.toLowerCase().replace('_', ' ')}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-1 font-semibold text-gray-800 transition-colors group-hover:text-blue-600 line-clamp-1">
            {product.name}
          </h3>
          <p className="mb-2 text-lg font-bold text-blue-600">৳{product.price.toLocaleString()}</p>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          {product.type && (
            <p className="mt-2 text-xs text-gray-400">{product.type}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Product List Item Component (List View)
function ProductListItem({ product, getProductImage }) {
  return (
    <Link href={`/pages/product/${product.id}`} className="group">
      <div className="flex flex-col overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl sm:flex-row">
        <div className="relative h-48 overflow-hidden sm:w-48">
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
        </div>
        <div className="flex-1 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                {product.name}
              </h3>
              {product.type && (
                <span className="inline-block px-2 py-1 mt-1 text-xs text-gray-500 bg-gray-100 rounded">
                  {product.type}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600">৳{product.price.toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-400 capitalize">
                {product.condition?.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>👁️ {product.viewCount || 0} views</span>
              <span>•</span>
              <span>📅 {new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
            <span className="text-sm font-medium text-blue-600 group-hover:underline">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}