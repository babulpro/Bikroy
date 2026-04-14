// src/app/page.js
import Link from 'next/link';

export default function HomePage() {
  const categories = [
    { name: 'Electronics', icon: '📱', href: '/category/electronics' },
    { name: 'Furniture', icon: '🛋️', href: '/category/furniture' },
    { name: 'Cars', icon: '🚗', href: '/category/cars' },
    { name: 'Property', icon: '🏠', href: '/category/property' },
    { name: 'Jobs', icon: '💼', href: '/category/jobs' },
    { name: 'Services', icon: '🔧', href: '/category/services' },
  ];

  const featuredProducts = [
    { id: 1, name: 'iPhone 14 Pro', price: '999', location: 'Dhaka', image: 'https://via.placeholder.com/300' },
    { id: 2, name: 'Sofa Set', price: '450', location: 'Chittagong', image: 'https://via.placeholder.com/300' },
    { id: 3, name: 'Toyota Corolla', price: '25000', location: 'Dhaka', image: 'https://via.placeholder.com/300' },
    { id: 4, name: '3 Bedroom Apartment', price: '150000', location: 'Dhaka', image: 'https://via.placeholder.com/300' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Buy & Sell Anything in Bangladesh
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90">
            Join millions of buyers and sellers on Bikroy.com
          </p>
          <Link
            href="/products"
            className="inline-block bg-yellow-400 text-blue-700 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">
            Popular Categories
          </h2>
          <p className="text-center text-gray-600 mb-12">Browse through our most popular categories</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all hover:-translate-y-1 duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-2">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">
            Featured Products
          </h2>
          <p className="text-center text-gray-600 mb-12">Handpicked products just for you</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white text-black rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                    Featured
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-blue-600 font-bold text-lg mb-1">৳{product.price}</p>
                  <p className="text-gray-500 text-sm flex items-center">
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
          
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">
            Why Choose Bikroy?
          </h2>
          <p className="text-center text-gray-600 mb-12">We make buying and selling easy and secure</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Safe & Secure</h3>
              <p className="text-gray-600 text-sm">Secure payments and buyer protection</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Fast & Easy</h3>
              <p className="text-gray-600 text-sm">Quick listing and instant messaging</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Best Prices</h3>
              <p className="text-gray-600 text-sm">Get the best deals from trusted sellers</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Mobile App</h3>
              <p className="text-gray-600 text-sm">Buy and sell on the go with our app</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Sell Your Products?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            List your products for free and reach millions of buyers
          </p>
          <Link
            href="/sell"
            className="inline-block bg-yellow-400 text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
          >
            Start Selling Now
          </Link>
        </div>
      </section>
    </div>
  );
}