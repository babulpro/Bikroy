// src/app/pages/social/linkedin/page.jsx
'use client';

export default function LinkedInPage() {
  const handleFollow = () => {
    window.open('https://linkedin.com/company/sellkoro', '_blank');
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-4 bg-blue-700 rounded-full">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Connect on LinkedIn</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Join our professional network for business updates and career opportunities
          </p>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-8 text-center text-white bg-gradient-to-r from-blue-700 to-blue-800">
            <div className="mb-4">
              <div className="inline-block p-3 rounded-full bg-white/20">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">SellKoro on LinkedIn</h2>
            <p className="mb-6 text-blue-100">Professional updates and company news</p>
            <button
              onClick={handleFollow}
              className="inline-flex items-center px-8 py-3 space-x-2 font-semibold text-blue-700 transition-colors bg-white rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
              </svg>
              <span>Follow Company Page</span>
            </button>
          </div>

          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">What you'll get:</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">💼</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Job Openings</h4>
                  <p className="text-sm text-gray-600">First to know about career opportunities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">📈</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Company Updates</h4>
                  <p className="text-sm text-gray-600">News about growth, partnerships, and milestones</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">🤝</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Industry Insights</h4>
                  <p className="text-sm text-gray-600">E-commerce trends and market analysis</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600">🌐</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Networking</h4>
                  <p className="text-sm text-gray-600">Connect with our team and industry professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}