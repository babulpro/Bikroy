// src/app/pages/how-to-buy/page.jsx
'use client';

import Link from 'next/link';

const buyingSteps = [
  {
    number: 1,
    title: "Browse or Search",
    icon: "🔍",
    description: "Use the search bar or browse categories to find products you're interested in.",
    tips: ["Use specific keywords", "Filter by price range", "Sort by newest or price"]
  },
  {
    number: 2,
    title: "Review Product Details",
    icon: "👁️",
    description: "Click on listings to view full details, photos, seller information, and pricing.",
    tips: ["Read descriptions carefully", "Check product condition", "View all photos"]
  },
  {
    number: 3,
    title: "Contact the Seller",
    icon: "💬",
    description: "Use the 'Send Message' button to ask questions or negotiate the price.",
    tips: ["Ask about product condition", "Negotiate respectfully", "Request additional photos"]
  },
  {
    number: 4,
    title: "Arrange Meeting",
    icon: "🤝",
    description: "Agree on a meeting place to inspect the product and complete the transaction.",
    tips: ["Meet in public places", "Bring a friend", "Inspect before paying"]
  },
  {
    number: 5,
    title: "Inspect the Product",
    icon: "🔬",
    description: "Thoroughly check the product to ensure it matches the description and photos.",
    tips: ["Test electronics", "Check for damages", "Verify authenticity"]
  },
  {
    number: 6,
    title: "Complete Payment",
    icon: "💳",
    description: "Make secure payment and get a receipt or proof of purchase.",
    tips: ["Use secure payment methods", "Get a receipt", "Keep seller's contact info"]
  }
];

const buyingTips = [
  { title: "Ask Questions", icon: "❓", description: "Don't hesitate to ask seller for more information" },
  { title: "Compare Prices", icon: "📊", description: "Check similar listings before making an offer" },
  { title: "Meet Safely", icon: "🛡️", description: "Always meet in public, well-lit locations" },
  { title: "Check Seller Ratings", icon: "⭐", description: "Review seller's history and ratings" },
  { title: "Negotiate Fairly", icon: "💬", description: "Make reasonable offers based on condition" },
  { title: "Verify Authenticity", icon: "✅", description: "For branded items, check for authenticity markers" }
];

export default function HowToBuyPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">How to Buy on SellKoro</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Find great deals and buy with confidence. Follow these simple steps for a smooth purchasing experience.
          </p>
        </div>

        {/* Steps Section */}
        <div className="mb-12">
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">Simple Steps to Buy</h2>
          <div className="space-y-6">
            {buyingSteps.map((step) => (
              <div key={step.number} className="overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row">
                  <div className="flex items-center justify-center p-4 bg-green-600 md:w-24">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center mb-3 space-x-3">
                      <span className="text-2xl">{step.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                    </div>
                    <p className="mb-3 text-gray-600">{step.description}</p>
                    <div className="p-3 rounded-lg bg-green-50">
                      <p className="mb-1 text-sm font-semibold text-green-800">💡 Tips:</p>
                      <ul className="space-y-1 text-sm text-green-700">
                        {step.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buying Tips Grid */}
        <div className="mb-12">
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">Smart Buying Tips</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {buyingTips.map((tip, index) => (
              <div key={index} className="p-5 text-center transition-all bg-white rounded-lg shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                  <span className="text-2xl">{tip.icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">{tip.title}</h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 text-center text-white bg-green-600 rounded-lg shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">Ready to Start Shopping?</h2>
          <p className="mb-6 opacity-90">Discover thousands of products from trusted sellers</p>
          <Link
            href="/pages/product/allProducts"
            className="inline-block px-8 py-3 font-semibold text-green-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-300"
          >
            Start Shopping Now
          </Link>
        </div>
      </div>
    </div>
  );
}