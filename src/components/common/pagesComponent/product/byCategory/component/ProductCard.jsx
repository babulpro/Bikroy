// src/app/pages/product/category/[id]/components/ProductCard.jsx
import Link from 'next/link';

export default function ProductCard({ product }) {
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
      <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={getProductImage()}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {product.isFeatured && (
            <span className="absolute px-2 py-1 text-xs font-semibold text-blue-700 bg-yellow-400 rounded top-2 right-2">Featured</span>
          )}
          {product.condition && (
            <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded ${badge.color}`}>{badge.label}</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-1 font-semibold text-gray-800 transition-colors group-hover:text-blue-600 line-clamp-1">
            {product.name}
          </h3>
          <p className="mb-2 text-lg font-bold text-blue-600">৳{product.price.toLocaleString()}</p>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          {product.type && <p className="mt-2 text-xs text-gray-400">{product.type}</p>}
          {(product.district || product.thana) && (
            <div className="flex items-center mt-2 text-xs text-gray-400">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{product.district}{product.thana && `, ${product.thana}`}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}