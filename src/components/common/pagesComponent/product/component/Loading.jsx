// src/app/pages/product/allProducts/components/LoadingSpinner.jsx
'use client';

export default function LoadingSpinner() {
  return (
    <div className="py-12 text-center">
      <div className="inline-block w-10 h-10 border-b-2 border-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}