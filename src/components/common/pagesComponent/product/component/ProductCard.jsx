// src/app/pages/product/allProducts/components/ProductCard.jsx
'use client';

import Link from 'next/link';

export default function ProductCard({ product, getProductImage, getConditionLabel }) {
  const conditionBadge = getConditionLabel(product.condition);

  return (
    <Link href={`/pages/product/productById/${product.id}`} className="group">
      <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-40 overflow-hidden bg-gray-100">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {product.isFeatured && (
            <span className="absolute px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 bg-yellow-400 rounded top-1 right-1">
              Featured
            </span>
          )}
          {product.condition && (
            <span className={`absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded ${conditionBadge.color}`}>
              {conditionBadge.label}
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 transition-colors line-clamp-1 group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-base font-bold text-blue-600">
              {product.currency === 'BDT' ? '৳' : '$'}{product.price.toLocaleString()}
            </p>
            <div className="flex items-center text-xs text-gray-400">
              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {product.viewCount || 0}
            </div>
          </div>
          {(product.division || product.district) && (
            <div className="flex items-center mt-1 text-[10px] text-gray-400">
              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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