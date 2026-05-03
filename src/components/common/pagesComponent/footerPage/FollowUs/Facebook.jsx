// src/app/pages/social/facebook/page.jsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FacebookPage() {
  const router = useRouter();

  const handleFollow = () => {
    window.open('https://facebook.com/sellkoro', '_blank');
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-4 bg-blue-600 rounded-full">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Follow us on Facebook</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Stay updated with the latest products, deals, and announcements from SellKoro
          </p>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-8 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="mb-4">
              <div className="inline-block p-3 rounded-full bg-white/20">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">SellKoro on Facebook</h2>
            <p className="mb-6 text-blue-100">Join our community of buyers and sellers</p>
            <button
              onClick={handleFollow}
              className="inline-flex items-center px-8 py-3 space-x-2 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Like our Page</span>
            </button>
          </div>

          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">What you'll find on our Facebook page:</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">📢</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Latest Announcements</h4>
                  <p className="text-sm text-gray-600">Get updates about new features and platform improvements</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">🎁</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Exclusive Deals</h4>
                  <p className="text-sm text-gray-600">Special offers and promotions for our followers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Tips & Guides</h4>
                  <p className="text-sm text-gray-600">Helpful advice for buying and selling safely</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">👥</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Community Stories</h4>
                  <p className="text-sm text-gray-600">Success stories from our users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}