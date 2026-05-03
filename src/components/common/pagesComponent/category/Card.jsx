// src/app/pages/product/categories/components/CategoryCard.jsx
import Link from 'next/link';

export default function CategoryCard({ category, variant = 'featured' }) {
  if (variant === 'featured') {
    return (
      <Link href={`/pages/product/categories/${category.id}`} className="group">
        <div className="overflow-hidden transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl hover:-translate-y-1">
          <div className="p-5 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 transition-all bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:from-blue-200 group-hover:to-blue-300">
              <span className="text-3xl">{category.icon || '📁'}</span>
            </div>
            <h3 className="font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
              {category.name}
            </h3>
            <p className="mt-1 text-xs text-gray-400">{category.productCount || 0} items</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/pages/product/categories/${category.id}`} className="group">
      <div className="transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200">
        <div className="flex items-center p-4 space-x-3">
          <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-blue-50 group-hover:bg-blue-100">
            <span className="text-xl">{category.icon || '📁'}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 transition-colors group-hover:text-blue-600">
              {category.name}
            </h3>
            <p className="text-xs text-gray-400">{category.productCount || 0} products</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 transition-colors group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}