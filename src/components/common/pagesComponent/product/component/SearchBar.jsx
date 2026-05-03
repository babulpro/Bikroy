// src/app/pages/product/allProducts/components/ProductSearchBar.jsx
'use client';

export default function ProductSearchBar({ search, onSearchChange, sortBy, onSortChange, onToggleFilters }) {
  return (
    <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input - Full width on mobile, flexible on desktop */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2.5 pl-10 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg className="absolute w-4 h-4 text-gray-400 left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {search && (
          <button onClick={() => onSearchChange('')} className="absolute text-gray-400 right-3 top-3 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sort By Select */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50"
        >
          <option value="newest">📅 Newest First</option>
          <option value="oldest">📅 Oldest First</option>
          <option value="price_low">💰 Price: Low to High</option>
          <option value="price_high">💰 Price: High to Low</option>
          <option value="name_asc">🔤 Name: A to Z</option>
          <option value="name_desc">🔤 Name: Z to A</option>
        </select>

        {/* Filter Toggle Button */}
        <button 
          onClick={onToggleFilters} 
          className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}