// src/app/pages/social/twitter/page.jsx
'use client';

import Link from 'next/link';

export default function TwitterPage() {
  const handleFollow = () => {
    window.open('https://twitter.com/sellkoro', '_blank');
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-4 bg-black rounded-full">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.968-11.458c0-.214-.005-.428-.015-.64A9.936 9.936 0 0024 4.59z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Follow us on Twitter</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Get real-time updates, news, and engage with our community
          </p>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-8 text-center text-white bg-gradient-to-r from-black to-gray-800">
            <div className="mb-4">
              <div className="inline-block p-3 rounded-full bg-white/20">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.968-11.458c0-.214-.005-.428-.015-.64A9.936 9.936 0 0024 4.59z"/>
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">@SellKoro</h2>
            <p className="mb-6 text-gray-300">Follow us for daily updates and news</p>
            <button
              onClick={handleFollow}
              className="inline-flex items-center px-8 py-3 space-x-2 font-semibold text-black transition-colors bg-white rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.968-11.458c0-.214-.005-.428-.015-.64A9.936 9.936 0 0024 4.59z"/>
              </svg>
              <span>Follow @SellKoro</span>
            </button>
          </div>

          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">What to expect:</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">📰</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Breaking News</h4>
                  <p className="text-sm text-gray-600">First to know about major platform updates</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">💬</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Community Engagement</h4>
                  <p className="text-sm text-gray-600">Join discussions and share your feedback</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">🔗</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Helpful Resources</h4>
                  <p className="text-sm text-gray-600">Tips, guides, and useful links shared daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}