'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
  });

  const [categories, setCategories] = useState([]);

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
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
        });

        const res = await fetch(`/api/product/all-products?${queryParams}`);
        const data = await res.json();

        if (data.status === 'success') {
          setProducts(data.products);
          setPagination({
            currentPage: data.pagination.page,
            totalPages: data.pagination.totalPages,
            totalProducts: data.pagination.total,
            limit: data.pagination.limit,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, pagination.currentPage]);

  // Handlers
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
    });
  };

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="max-w-6xl px-4 mx-auto">

        <h1 className="mb-6 text-3xl font-bold text-center">
          All Products
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full p-3 mb-6 border rounded"
        />

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">

          <select
            value={filters.categoryId}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Condition</option>
            <option value="NEW">New</option>
            <option value="GOOD">Good</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="p-2 border rounded"
          />

        </div>

        {/* Reset */}
        <button
          onClick={resetFilters}
          className="px-4 py-2 mb-6 text-white bg-red-500 rounded"
        >
          Reset Filters
        </button>

        {/* Products */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center">No products found</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {products.map(product => (
              <Link key={product.id} href={`/pages/product/${product.id}`}>
                <div className="p-4 bg-white rounded shadow hover:shadow-lg">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-blue-600">৳{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}