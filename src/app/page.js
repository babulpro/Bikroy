// src/app/page.js
'use client';

import Link from 'next/link';
import FeaturedProducts from '@/components/common/pagesComponent/homePage/Product';
import Category from '@/components/common/pagesComponent/homePage/Category';
import Cta from '@/components/common/pagesComponent/homePage/Cta';

export default function HomePage() {
  

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            Buy & Sell Anything in Bangladesh
          </h1>
          <p className="mb-8 text-lg sm:text-xl md:text-2xl opacity-90">
            Join millions of buyers and sellers on sellkoro
          </p>
          <Link
            href="/pages/product/categories"
            className="inline-block px-6 py-3 font-semibold text-blue-700 transition-colors bg-yellow-400 rounded-lg shadow-lg sm:px-8 hover:bg-yellow-300"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      
      <Category/>
        {/* Featured Products Section */}
      
      <FeaturedProducts />
     




      {/* CTA Section */}
      <Cta/>
    </div>
  );
}