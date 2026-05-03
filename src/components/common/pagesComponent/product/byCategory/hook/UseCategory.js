// src/app/pages/product/category/[id]/components/useCategoryProducts.js
'use client';

import { useState, useEffect } from 'react';

export function useCategoryProducts(categoryId) {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      const productsRes = await fetch(`/api/product/allProduct/productByCategory?categoryId=${categoryId}`);
      const productsData = await productsRes.json();
      
      if (productsData.success) {
        setProducts(productsData.data?.products || []);
        setCategory(productsData.data?.category || null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { category, products, loading };
}