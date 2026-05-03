// src/app/pages/product/category/[id]/components/CategoryHeader.jsx
export default function CategoryHeader({ category, productCount }) {
  return (
    <div className="mb-8 text-center">
      <div className="inline-block p-4 mb-4 bg-blue-100 rounded-full">
        <span className="text-5xl">{category?.icon || '📁'}</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">{category?.name || 'Products'}</h1>
      {category?.description && (
        <p className="max-w-2xl mx-auto mt-2 text-gray-600">{category.description}</p>
      )}
      <p className="mt-2 text-sm text-gray-500">{productCount} products found</p>
    </div>
  );
}