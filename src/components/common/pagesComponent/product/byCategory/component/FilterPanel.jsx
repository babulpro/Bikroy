// src/app/pages/product/category/[id]/components/FilterPanel.jsx
export default function FilterPanel({ 
  filters, 
  onFilterChange, 
  categories, 
  divisions, 
  districts, 
  thanas 
}) {
  return (
    <div className="p-4 mb-5 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <FilterSelect
          label="Condition"
          value={filters.condition}
          onChange={(val) => onFilterChange('condition', val)}
          options={[
            { value: '', label: 'All Conditions' },
            { value: 'NEW', label: 'New' },
            { value: 'LIKE_NEW', label: 'Like New' },
            { value: 'GOOD', label: 'Good' },
            { value: 'FAIR', label: 'Fair' },
            { value: 'POOR', label: 'Poor' }
          ]}
        />

        {categories.length > 0 && (
          <FilterSelect
            label="Product Type"
            value={filters.type}
            onChange={(val) => onFilterChange('type', val)}
            options={[{ value: '', label: 'All Types' }, ...categories.map(c => ({ value: c, label: c }))]}
          />
        )}

        <FilterSelect
          label="Division"
          value={filters.division}
          onChange={(val) => onFilterChange('division', val)}
          options={[{ value: '', label: 'All Divisions' }, ...divisions.map(d => ({ value: d.id, label: d.name }))]}
        />

        <FilterSelect
          label="District"
          value={filters.district}
          onChange={(val) => onFilterChange('district', val)}
          options={[{ value: '', label: 'All Districts' }, ...districts.map(d => ({ value: d, label: d }))]}
          disabled={!filters.division}
        />

        <FilterSelect
          label="Thana/Area"
          value={filters.thana}
          onChange={(val) => onFilterChange('thana', val)}
          options={[{ value: '', label: 'All Areas' }, ...thanas.map(t => ({ value: t, label: t }))]}
          disabled={!filters.district}
        />

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

function FilterSelect({ label, value, onChange, options, disabled = false }) {
  return (
    <div>
      <label className="block mb-1 text-xs font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}