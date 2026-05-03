// src/app/pages/product/category/[id]/components/ProductListItem.jsx
import Link from 'next/link';

export default function ProductListItem({ product }) {
  const getProductImage = () => {
    return product.image1 || product.image2 || product.image3 || product.image4 || product.image5 || '/placeholder-image.jpg';
  };

  const getConditionBadge = (condition) => {
    const conditions = {
      NEW: { label: 'New', color: 'bg-green-100 text-green-800' },
      LIKE_NEW: { label: 'Like New', color: 'bg-blue-100 text-blue-800' },
      GOOD: { label: 'Good', color: 'bg-yellow-100 text-yellow-800' },
      FAIR: { label: 'Fair', color: 'bg-orange-100 text-orange-800' },
      POOR: { label: 'Poor', color: 'bg-red-100 text-red-800' }
    };
    return conditions[condition] || { label: condition, color: 'bg-gray-100 text-gray-800' };
  };

  const badge = getConditionBadge(product.condition);

  return (
    <Link href={`/pages/product/productById/${product.id}`} className="group">
      <div className="flex flex-col overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl sm:flex-row">
        <div className="relative h-48 overflow-hidden sm:w-48">
          <img
            src={getProductImage()}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {product.isFeatured && (
            <span className="absolute px-2 py-1 text-xs font-semibold text-blue-700 bg-yellow-400 rounded top-2 right-2">Featured</span>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                {product.name}
              </h3>
              {product.type && <span className="inline-block px-2 py-1 mt-1 text-xs text-gray-500 bg-gray-100 rounded">{product.type}</span>}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600">৳{product.price.toLocaleString()}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${badge.color}`}>{badge.label}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>👁️ {product.viewCount || 0} views</span>
              <span>•</span>
              <span>📅 {new Date(product.createdAt).toLocaleDateString()}</span>
              {(product.district || product.thana) && (
                <>
                  <span>•</span>
                  <span>📍 {product.district}{product.thana && `, ${product.thana}`}</span>
                </>
              )}
            </div>
            <span className="text-sm font-medium text-blue-600 group-hover:underline">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}