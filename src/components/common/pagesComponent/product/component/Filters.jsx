// src/app/pages/product/allProducts/components/ProductFilters.jsx
'use client';

export default function ProductFilters({ filters, categories, divisions, districts, thanas, onFilterChange }) {
  return (
    <div className="p-4 mb-5 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category Filter */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">Category</label>
          <select
            value={filters.categoryId}
            onChange={(e) => onFilterChange('categoryId', e.target.value)}
            className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">Condition</label>
          <select
            value={filters.condition}
            onChange={(e) => onFilterChange('condition', e.target.value)}
            className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Conditions</option>
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </select>
        </div>

        {/* Division Filter */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">Division</label>
          <select
            value={filters.division}
            onChange={(e) => onFilterChange('division', e.target.value)}
            className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Divisions</option>
            {divisions.map(div => (
              <option key={div.id} value={div.id}>{div.name}</option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">District</label>
          <select
            value={filters.district}
            onChange={(e) => onFilterChange('district', e.target.value)}
            disabled={!filters.division}
            className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Thana Filter */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">Thana/Area</label>
          <select
            value={filters.thana}
            onChange={(e) => onFilterChange('thana', e.target.value)}
            disabled={!filters.district}
            className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Areas</option>
            {thanas.map(thana => (
              <option key={thana} value={thana}>{thana}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700">Price Range</label>
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-1/2 px-2 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-1/2 px-2 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}