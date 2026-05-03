// src/app/pages/product/categories/components/CategoryHero.jsx
'use client';

export default function CategoryHero({ searchTerm, onSearchChange, onClearSearch }) {
  return (
    <div className="py-16 text-white bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-bold md:text-5xl">Browse Categories</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-90">
          Find exactly what you're looking for by exploring our wide range of categories
        </p>
        
        <div className="max-w-md mx-auto mt-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-12 text-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button onClick={onClearSearch} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}