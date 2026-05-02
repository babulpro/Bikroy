// src/app/pages/product/category/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

export default function CategoryProductsPage() {
  const params = useParams();
  const { id } = params;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  // Location filters
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [thana, setThana] = useState('');
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);

  // Fetch category and products
  useEffect(() => {
    if (id) {
      fetchCategoryAndProducts();
    }
  }, [id]);

  // Update districts when division changes
  useEffect(() => {
    if (division) {
      setDistricts(BANGLADESH_DISTRICTS[division] || []);
      setDistrict('');
      setThana('');
      setThanas([]);
    } else {
      setDistricts([]);
      setThanas([]);
    }
  }, [division]);

  // Update thanas when district changes
  useEffect(() => {
    if (district) {
      setThanas(BANGLADESH_THANAS[district] || []);
      setThana('');
    } else {
      setThanas([]);
    }
  }, [district]);

  // Apply filters and sorting
  useEffect(() => {
    if (products.length > 0) {
      applyFiltersAndSort();
    }
  }, [products, priceRange, selectedCondition, selectedType, sortBy, division, district, thana]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      
      const productsRes = await fetch(`/api/product/allProduct/productByCategory?categoryId=${id}`);
      const productsData = await productsRes.json();
      
      if (productsData.success) {
        const productsList = productsData.data?.products || [];
        setProducts(productsList);
        setFilteredProducts(productsList);
        
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

    // Filter by location
    if (division) {
      filtered = filtered.filter(p => p.division === division);
    }
    if (district) {
      filtered = filtered.filter(p => p.district === district);
    }
    if (thana) {
      filtered = filtered.filter(p => p.thana === thana);
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
    setDivision('');
    setDistrict('');
    setThana('');
  };

  const getUniqueTypes = () => {
    const types = products.map(p => p.type).filter(t => t && t.trim());
    return [...new Set(types)];
  };

  const getProductImage = (product) => {
    return product.image1 || product.image2 || product.image3 || product.image4 || product.image5 || '/placeholder-image.jpg';
  };

  const getConditionBadge = (condition) => {
    const conditions = {
      NEW: { label: 'New', color: 'bg-green-100 text-green-800' },
      LIKE_NEW: { label: 'Like New', color: 'bg-blue-100 text-blue-800' },
      GOOD: { label: 'Good', color: 'bg-yellow-100 text-yellow-800' },
      FAIR: { label: 'Fair', color: 'bg-orange-100 text-orange-800' },
      POOR: { label: 'Poor', color: 'bg-red-100 text-red-800' }
    };
    return conditions[condition] || { label: condition, color: 'bg-gray-100 text-gray-800' };
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
        {/* <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-4 bg-blue-100 rounded-full">
            <span className="text-5xl">{category?.icon || '📁'}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">{category?.name || 'Products'}</h1>
          {category?.description && (
            <p className="max-w-2xl mx-auto mt-2 text-gray-600">{category.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">{filteredProducts.length} products found</p>
        </div> */}

        {/* Search and Sort Bar */}
        <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg sm:w-auto"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-gray-700">Filters</span>
            </div>
            <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Tags */}
        {(selectedCondition || division || district || thana || priceRange.min || priceRange.max || selectedType) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCondition && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                Condition: {selectedCondition.toLowerCase().replace('_', ' ')}
                <button onClick={() => setSelectedCondition('')} className="hover:text-blue-900">×</button>
              </span>
            )}
            {division && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                Division: {BANGLADESH_DIVISIONS.find(d => d.id === division)?.name}
                <button onClick={() => { setDivision(''); setDistrict(''); setThana(''); }} className="hover:text-blue-900">×</button>
              </span>
            )}
            {district && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                District: {district}
                <button onClick={() => { setDistrict(''); setThana(''); }} className="hover:text-blue-900">×</button>
              </span>
            )}
            {thana && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                Area: {thana}
                <button onClick={() => setThana('')} className="hover:text-blue-900">×</button>
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                Price: ৳{priceRange.min || 0} - ৳{priceRange.max || '∞'}
                <button onClick={() => setPriceRange({ min: '', max: '' })} className="hover:text-blue-900">×</button>
              </span>
            )}
            {selectedType && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                Type: {selectedType}
                <button onClick={() => setSelectedType('')} className="hover:text-blue-900">×</button>
              </span>
            )}
            <button onClick={resetFilters} className="px-2 py-1 text-xs text-red-600 bg-red-100 rounded hover:bg-red-200">
              Clear All
            </button>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 mb-5 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Condition Filter */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
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

              {/* Type Filter */}
              {getUniqueTypes().length > 0 && (
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">Product Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {getUniqueTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Division Filter */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Division</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
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
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!division}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">All Districts</option>
                  {districts.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* Thana Filter */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Thana/Area</label>
                <select
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  disabled={!district}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">All Areas</option>
                  {thanas.map(area => (
                    <option key={area} value={area}>{area}</option>
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
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-1/2 px-2 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-1/2 px-2 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Products Section */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-lg shadow-lg">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No Products Found</h3>
                <p className="text-gray-600">Try adjusting your filters or browse other categories.</p>
                <button onClick={resetFilters} className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Clear All Filters
                </button>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} getProductImage={getProductImage} getConditionBadge={getConditionBadge} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductListItem key={product.id} product={product} getProductImage={getProductImage} getConditionBadge={getConditionBadge} />
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
function ProductCard({ product, getProductImage, getConditionBadge }) {
  const conditionBadge = getConditionBadge(product.condition);
  
  return (
    <Link href={`/pages/product/productById/${product.id}`} className="group">
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
            <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded ${conditionBadge.color}`}>
              {conditionBadge.label}
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
          {(product.district || product.thana) && (
            <div className="flex items-center mt-2 text-xs text-gray-400">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{product.district}{product.thana && `, ${product.thana}`}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Product List Item Component (List View)
function ProductListItem({ product, getProductImage, getConditionBadge }) {
  const conditionBadge = getConditionBadge(product.condition);
  
  return (
    <Link href={`/pages/product/productById/${product.id}`} className="group">
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
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${conditionBadge.color}`}>
                {conditionBadge.label}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>👁️ {product.viewCount || 0} views</span>
              <span>•</span>
              <span>📅 {new Date(product.createdAt).toLocaleDateString()}</span>
              {(product.district || product.thana) && (
                <>
                  <span>•</span>
                  <span>📍 {product.district}{product.thana && `, ${product.thana}`}</span>
                </>
              )}
            </div>
            <span className="text-sm font-medium text-blue-600 group-hover:underline">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}