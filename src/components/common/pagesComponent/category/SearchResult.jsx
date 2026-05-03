import CategoryCard from "./Card";

// src/app/pages/product/categories/components/SearchResults.jsx
 ;

export default function SearchResults({ searchTerm, categories, onClearSearch }) {
  if (categories.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Search Results for "{searchTerm}"
          </h2>
          <button onClick={onClearSearch} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Clear Search
          </button>
        </div>
        <div className="p-12 text-center bg-white rounded-lg shadow-lg">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-800">No Categories Found</h3>
          <p className="text-gray-600">We couldn't find any categories matching "{searchTerm}"</p>
          <button onClick={onClearSearch} className="px-6 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            Browse All Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Search Results for "{searchTerm}"
        </h2>
        <button onClick={onClearSearch} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Clear Search
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} variant="list" />
        ))}
      </div>
    </div>
  );
}