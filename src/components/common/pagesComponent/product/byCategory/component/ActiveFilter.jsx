// src/app/pages/product/category/[id]/components/ActiveFilters.jsx
export default function ActiveFilters({ 
  filters, 
  divisions, 
  onRemove, 
  onClearAll 
}) {
  const hasFilters = filters.condition || filters.division || filters.district || 
                     filters.thana || filters.minPrice || filters.maxPrice || filters.type;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.condition && (
        <FilterTag label={`Condition: ${filters.condition.toLowerCase().replace('_', ' ')}`} onRemove={() => onRemove('condition')} />
      )}
      {filters.division && (
        <FilterTag label={`Division: ${divisions.find(d => d.id === filters.division)?.name}`} onRemove={() => onRemove('division')} />
      )}
      {filters.district && (
        <FilterTag label={`District: ${filters.district}`} onRemove={() => onRemove('district')} />
      )}
      {filters.thana && (
        <FilterTag label={`Area: ${filters.thana}`} onRemove={() => onRemove('thana')} />
      )}
      {(filters.minPrice || filters.maxPrice) && (
        <FilterTag label={`Price: ৳${filters.minPrice || 0} - ৳${filters.maxPrice || '∞'}`} onRemove={() => { onRemove('minPrice'); onRemove('maxPrice'); }} />
      )}
      {filters.type && (
        <FilterTag label={`Type: ${filters.type}`} onRemove={() => onRemove('type')} />
      )}
      <button onClick={onClearAll} className="px-2 py-1 text-xs text-red-600 bg-red-100 rounded hover:bg-red-200">
        Clear All
      </button>
    </div>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900">×</button>
    </span>
  );
}