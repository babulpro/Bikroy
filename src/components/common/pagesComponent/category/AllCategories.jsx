// src/app/pages/product/categories/components/AllCategories.jsx

import CategoryCard from "./Card";

 

export default function AllCategories({ categories }) {
  if (categories.length === 0) return null;
  
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">All Categories</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} variant="list" />
        ))}
      </div>
    </div>
  );
}