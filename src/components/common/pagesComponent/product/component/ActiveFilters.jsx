// src/app/pages/product/allProducts/components/ActiveFilters.jsx
'use client';

export default function ActiveFilters({ filters, categories, divisions, onRemoveFilter, onClearAll }) {
  const hasFilters = filters.categoryId || filters.condition || filters.division || filters.district || filters.thana || filters.minPrice || filters.maxPrice;
  
  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.categoryId && categories.find(c => c.id === filters.categoryId) && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
          {categories.find(c => c.id === filters.categoryId).name}
          <button onClick={() => onRemoveFilter('categoryId')} className="hover:text-blue-900">×</button>
        </span>
      )}
      {filters.condition && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
          {filters.condition}
          <button onClick={() => onRemoveFilter('condition')} className="hover:text-blue-900">×</button>
        </span>
      )}
      {filters.division && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
          {divisions.find(d => d.id === filters.division)?.name}
          <button onClick={() => onRemoveFilter('division')} className="hover:text-blue-900">×</button>
        </span>
      )}
      {filters.district && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
          {filters.district}
          <button onClick={() => onRemoveFilter('district')} className="hover:text-blue-900">×</button>
        </span>
      )}
      {filters.thana && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
          {filters.thana}
          <button onClick={() => onRemoveFilter('thana')} className="hover:text-blue-900">×</button>
        </span>
      )}
      {(filters.minPrice || filters.maxPrice) && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
          ৳{filters.minPrice || 0} - ৳{filters.maxPrice || '∞'}
          <button onClick={() => { onRemoveFilter('minPrice'); onRemoveFilter('maxPrice'); }} className="hover:text-blue-900">×</button>
        </span>
      )}
      <button onClick={onClearAll} className="px-2 py-1 text-xs text-red-600 bg-red-100 rounded hover:bg-red-200">
        Clear All
      </button>
    </div>
  );
}