// src/app/pages/product/categories/components/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div className="py-12 text-center">
      <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading categories...</p>
    </div>
  );
}