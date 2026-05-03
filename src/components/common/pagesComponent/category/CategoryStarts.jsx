// src/app/pages/product/categories/components/CategoryStats.jsx
export default function CategoryStats({ categories }) {
  const totalCategories = categories.length;
  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
  const categoriesWithIcons = categories.filter(cat => cat.icon).length;

  return (
    <div className="p-6 mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
      <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
        <div>
          <div className="text-2xl font-bold text-blue-600">{totalCategories}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div>
            <div className="text-2xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">Active Sellers</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">24/7</div>
          <div className="text-sm text-gray-600">Customer Support</div>
        </div>
      </div>
    </div>
  );
}