// src/app/pages/how-to-sell/page.jsx
'use client';

import Link from 'next/link';

const steps = [
  {
    number: 1,
    title: "Create an Account",
    icon: "📝",
    description: "Sign up for a free SellKoro account. It only takes a few minutes and gives you access to our entire marketplace.",
    tips: ["Use a valid email address", "Create a strong password", "Complete your profile"]
  },
  {
    number: 2,
    title: "Click on 'Sell' Button",
    icon: "🖱️",
    description: "Navigate to the 'Sell' button in the top navigation menu to start creating your listing.",
    tips: ["Make sure you're logged in", "Have your product details ready"]
  },
  {
    number: 3,
    title: "Add Product Details",
    icon: "📋",
    description: "Fill in accurate information about your product including title, description, price, and condition.",
    tips: ["Use clear, descriptive titles", "Highlight key features", "Set a competitive price"]
  },
  {
    number: 4,
    title: "Upload Photos",
    icon: "📸",
    description: "Add high-quality photos of your product from different angles. The first image will be your primary photo.",
    tips: ["Use good lighting", "Show any defects", "Include size references"]
  },
  {
    number: 5,
    title: "Set Your Price",
    icon: "💰",
    description: "Choose a fair price for your item. Research similar products to stay competitive.",
    tips: ["Check market prices", "Consider negotiating room", "Free items get more attention"]
  },
  {
    number: 6,
    title: "Publish Your Listing",
    icon: "🚀",
    description: "Review all details and publish your listing. It will go live immediately and be visible to buyers.",
    tips: ["Double-check all information", "You can edit later", "Promote your listing"]
  }
];

const sellingTips = [
  { title: "Take Great Photos", icon: "📷", description: "Clear, well-lit photos attract more buyers" },
  { title: "Write Detailed Descriptions", icon: "✍️", description: "Include brand, size, condition, and any defects" },
  { title: "Price Competitively", icon: "🏷️", description: "Research similar items before setting price" },
  { title: "Respond Quickly", icon: "⚡", description: "Fast responses lead to faster sales" },
  { title: "Be Honest", icon: "🤝", description: "Accurate listings build trust with buyers" },
  { title: "Offer Delivery Options", icon: "🚚", description: "Flexible delivery increases buyer interest" }
];

export default function HowToSellPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">How to Sell on SellKoro</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Start selling your products quickly and easily. Follow these simple steps to reach millions of buyers.
          </p>
        </div>

        {/* Steps Section */}
        <div className="mb-12">
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">Simple Steps to Start Selling</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row">
                  <div className="flex items-center justify-center p-4 bg-blue-600 md:w-24">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center mb-3 space-x-3">
                      <span className="text-2xl">{step.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                    </div>
                    <p className="mb-3 text-gray-600">{step.description}</p>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <p className="mb-1 text-sm font-semibold text-blue-800">💡 Tips:</p>
                      <ul className="space-y-1 text-sm text-blue-700">
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

        {/* Selling Tips Grid */}
        <div className="mb-12">
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">Pro Tips for Successful Selling</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sellingTips.map((tip, index) => (
              <div key={index} className="p-5 text-center transition-all bg-white rounded-lg shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                  <span className="text-2xl">{tip.icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">{tip.title}</h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 text-center text-white bg-blue-600 rounded-lg shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">Ready to Start Selling?</h2>
          <p className="mb-6 opacity-90">Join thousands of successful sellers on SellKoro</p>
          <Link
            href="/pages/product/item/addProduct"
            className="inline-block px-8 py-3 font-semibold text-blue-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-300"
          >
            Start Selling Now
          </Link>
        </div>
      </div>
    </div>
  );
}