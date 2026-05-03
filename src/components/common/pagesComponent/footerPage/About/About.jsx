 
'use client';

 import { useState } from "react";

export default function About() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">About SellKoro</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
        </div>

        {/* Mission Section */}
        <div className="mb-12">
          <div className="overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Our Mission</h2>
            </div>
            <div className="p-6">
              <p className="leading-relaxed text-gray-700">
                At SellKoro, our mission is to empower people and businesses in Bangladesh by providing 
                a trusted, easy-to-use online marketplace. We connect buyers and sellers, making it 
                simple to buy and sell anything from electronics and furniture to cars and property. 
                We believe in creating economic opportunities and fostering a vibrant community where 
                everyone can thrive.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-12">
          <div className="overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Our Story</h2>
            </div>
            <div className="p-6">
              <p className="mb-4 leading-relaxed text-gray-700">
                Founded in 2024, SellKoro started with a simple idea: to make buying and selling in 
                Bangladesh easier, safer, and more accessible for everyone. What began as a small 
                startup has grown into one of the country's leading online marketplaces, serving 
                millions of users across Bangladesh.
              </p>
              <p className="leading-relaxed text-gray-700">
                Today, SellKoro is home to thousands of sellers and millions of products, from 
                everyday essentials to unique finds. We continue to innovate and improve our platform, 
                ensuring that every transaction is smooth, secure, and satisfying.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Our Values</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-6 text-center transition-all bg-white rounded-lg shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Trust</h3>
              <p className="text-sm text-gray-600">Building trust through transparency and security</p>
            </div>
            <div className="p-6 text-center transition-all bg-white rounded-lg shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Innovation</h3>
              <p className="text-sm text-gray-600">Continuously improving our platform</p>
            </div>
            <div className="p-6 text-center transition-all bg-white rounded-lg shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Community</h3>
              <p className="text-sm text-gray-600">Empowering local communities and businesses</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-8 text-white bg-blue-600 rounded-lg shadow-xl">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            <div>
              <div className="text-3xl font-bold">1M+</div>
              <div className="text-sm opacity-90">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500K+</div>
              <div className="text-sm opacity-90">Products Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100K+</div>
              <div className="text-sm opacity-90">Active Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">64</div>
              <div className="text-sm opacity-90">Districts Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}