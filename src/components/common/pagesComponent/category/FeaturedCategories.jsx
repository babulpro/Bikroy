// src/app/pages/product/categories/components/FeaturedCategories.jsx
import Link from 'next/link';
import CategoryCard from './Card';
 

export default function FeaturedCategories({ categories }) {
  if (categories.length === 0) return null;
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Popular Categories</h2>
        <Link href="/pages/product/allProducts" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All Products →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} variant="featured" />
        ))}
      </div>
    </div>
  );
}