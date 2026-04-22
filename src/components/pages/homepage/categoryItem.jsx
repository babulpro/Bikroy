// 'use client';

// import Link from 'next/link';

// export default function CategoryItem({ categories }) {
//   return (
//     <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
//       {categories.length > 0 && (
//         <div className="mb-12">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Popular Categories</h2>
//               <p className="mt-1 text-sm text-gray-500">Browse through our most popular categories</p>
//             </div>
//             <Link href="/pages/product/products" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
//               View All Products →
//             </Link>
//           </div>
          
//           {/* Side by Side Horizontal Layout */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {categories.map((category) => (
//               <Link
//                 key={category.id}
//                 href={`/pages/product/categories/${category.id}`}
//                 className="group"
//               >
//                 <div className="flex items-center p-3 space-x-3 transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200">
//                   {/* Icon Circle */}
//                   <div className="flex items-center justify-center w-10 h-10 transition-colors bg-blue-100 rounded-full group-hover:bg-blue-200">
//                     <span className="text-xl">
//                       {category.icon || '📁'}
//                     </span>
//                   </div>
                  
//                   {/* Category Info */}
//                   <div className="flex-1">
//                     <h3 className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
//                       {category.name}
//                     </h3>
//                     <p className="text-xs text-gray-400">
//                       {category.productCount || 0} items
//                     </p>
//                   </div>
                  
//                   {/* Arrow */}
//                   <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }