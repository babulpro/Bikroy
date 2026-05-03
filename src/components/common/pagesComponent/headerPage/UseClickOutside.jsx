// src/hooks/useClickOutside.js
'use client';

import { useEffect } from 'react';

export function useClickOutside(ref, callback, excludeClass = null) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        if (excludeClass && event.target.closest(excludeClass)) {
          return;
        }
        callback();
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [ref, callback, excludeClass]);
}