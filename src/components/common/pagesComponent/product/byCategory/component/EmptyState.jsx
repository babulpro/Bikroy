// src/app/pages/product/category/[id]/components/EmptyState.jsx
export default function EmptyState({ onReset }) {
  return (
    <div className="p-12 text-center bg-white rounded-lg shadow-lg">
      <div className="mb-4 text-6xl">🔍</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">No Products Found</h3>
      <p className="text-gray-600">Try adjusting your filters or browse other categories.</p>
      <button onClick={onReset} className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
        Clear All Filters
      </button>
    </div>
  );
}