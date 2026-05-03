// src/components/common/pagesComponent/product/hooks/UseProduct.js
'use client';

import { useState, useCallback } from 'react';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  });

  const fetchProducts = useCallback(async (filters, page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page,
        limit: 12,
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
          currentPage: data.pagination?.page || page,
          totalPages: data.pagination?.totalPages || 1,
          totalProducts: data.pagination?.total || 0,
          limit: data.pagination?.limit || 12,
        });
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, pagination, fetchProducts, setPagination };
}