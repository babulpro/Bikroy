// src/app/pages/press/page.jsx
'use client';

import Link from 'next/link';

const pressArticles = [
  {
    id: 1,
    title: "SellKoro Raises $5M to Expand Marketplace Operations",
    date: "March 15, 2025",
    source: "TechCrunch",
    excerpt: "Bangladesh's leading online marketplace has secured funding to accelerate growth.",
    link: "#"
  },
  {
    id: 2,
    title: "How SellKoro is Revolutionizing E-commerce in Bangladesh",
    date: "February 10, 2025",
    source: "The Daily Star",
    excerpt: "The platform has grown to serve over 1 million users across the country.",
    link: "#"
  },
  {
    id: 3,
    title: "SellKoro Launches Mobile App to Reach More Users",
    date: "January 5, 2025",
    source: "Dhaka Tribune",
    excerpt: "New app makes buying and selling easier than ever before.",
    link: "#"
  },
  {
    id: 4,
    title: "SellKoro Partners with Local Businesses to Boost Economy",
    date: "December 20, 2024",
    source: "Financial Express",
    excerpt: "Partnership aims to support small and medium enterprises across Bangladesh.",
    link: "#"
  }
];

const mediaKits = [
  { name: "Brand Logo Pack", size: "2.5 MB", format: "ZIP" },
  { name: "Press Kit 2025", size: "5.1 MB", format: "PDF" },
  { name: "Media Images", size: "8.3 MB", format: "ZIP" },
  { name: "Company Fact Sheet", size: "1.2 MB", format: "PDF" }
];

export default function Press() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Press & Media</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Latest news, press releases, and media resources from SellKoro
          </p>
        </div>

        {/* Featured Coverage */}
        <div className="mb-12">
          <div className="overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Featured Coverage</h2>
            </div>
            <div className="p-6 space-y-6">
              {pressArticles.map((article) => (
                <div key={article.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex flex-col mb-2 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                    <span className="mt-1 text-sm text-gray-500 md:mt-0">{article.date}</span>
                  </div>
                  <p className="mb-2 text-sm text-blue-600">{article.source}</p>
                  <p className="text-gray-600">{article.excerpt}</p>
                  <a
                    href={article.link}
                    className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Read more →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Media Kit */}
        <div className="mb-12">
          <div className="overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Media Kit</h2>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-600">
                Download logos, images, and other media resources for press coverage.
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {mediaKits.map((kit, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{kit.name}</p>
                      <p className="text-xs text-gray-500">{kit.size} • {kit.format}</p>
                    </div>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Press Contact */}
        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 bg-blue-600">
            <h2 className="text-xl font-bold text-white">Media Inquiries</h2>
          </div>
          <div className="p-6 text-center">
            <p className="mb-4 text-gray-600">
              For press inquiries, interview requests, or additional information, please contact our media team.
            </p>
            <div className="inline-flex items-center space-x-4">
              <a
                href="mailto:press@sellkoro.com"
                className="px-6 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                press@sellkoro.com
              </a>
              <a
                href="tel:+8801234567890"
                className="px-6 py-2 font-semibold text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                +880 1234 567890
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}