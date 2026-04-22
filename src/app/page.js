// src/app/page.js
import { fetchCategories } from '@/components/common/allFunctionCall/category';
import CategoryItem from '@/components/pages/homepage/categoryItem';
import Link from 'next/link';

export default async function HomePage() {
   const categories = await fetchCategories();
   
 
  
   

  const featuredProducts = [
    { id: 1, name: 'iPhone 14 Pro', price: '999', location: 'Dhaka', image: 'https://via.placeholder.com/300' },
    { id: 2, name: 'Sofa Set', price: '450', location: 'Chittagong', image: 'https://via.placeholder.com/300' },
    { id: 3, name: 'Toyota Corolla', price: '25000', location: 'Dhaka', image: 'https://via.placeholder.com/300' },
    { id: 4, name: '3 Bedroom Apartment', price: '150000', location: 'Dhaka', image: 'https://via.placeholder.com/300' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            Buy & Sell Anything in Bangladesh
          </h1>
          <p className="mb-8 text-lg sm:text-xl md:text-2xl opacity-90">
            Join millions of buyers and sellers on Bikroy.com
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 font-semibold text-blue-700 transition-colors bg-yellow-400 rounded-lg shadow-lg sm:px-8 hover:bg-yellow-300"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryItem categories={categories} />

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 sm:text-3xl">
            Featured Products
          </h2>
          <p className="mb-12 text-center text-gray-600">Handpicked products just for you</p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="overflow-hidden text-black transition-all duration-300 bg-white rounded-lg shadow-md group hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute px-2 py-1 text-xs font-semibold text-blue-700 bg-yellow-400 rounded top-2 right-2">
                    Featured
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <p className="mb-1 text-lg font-bold text-blue-600">৳{product.price}</p>
                  <p className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {product.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-blue-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 sm:text-3xl">
            Why Choose Bikroy?
          </h2>
          <p className="mb-12 text-center text-gray-600">We make buying and selling easy and secure</p>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Safe & Secure</h3>
              <p className="text-sm text-gray-600">Secure payments and buyer protection</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Fast & Easy</h3>
              <p className="text-sm text-gray-600">Quick listing and instant messaging</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Best Prices</h3>
              <p className="text-sm text-gray-600">Get the best deals from trusted sellers</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Mobile App</h3>
              <p className="text-sm text-gray-600">Buy and sell on the go with our app</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Ready to Sell Your Products?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            List your products for free and reach millions of buyers
          </p>
          <Link
            href="/sell"
            className="inline-block px-8 py-3 font-semibold text-blue-700 transition-colors bg-yellow-400 rounded-lg shadow-lg hover:bg-yellow-300"
          >
            Start Selling Now
          </Link>
        </div>
      </section>
    </div>
  );
}