// src/components/common/pagesComponent/product/hooks/UseCategory.js
'use client';

import { useState, useEffect } from 'react';

export function useCategories() {
  const [categories, setCategories] = useState([]);

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
  }, []); // Empty dependency array - runs only once

  return { categories };
}