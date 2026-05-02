// src/app/pages/help/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    id: 1,
    question: "How do I create an account?",
    answer: "Click on the 'Register' button in the top right corner, fill in your details, and verify your email address. It's free and takes only a few minutes."
  },
  {
    id: 2,
    question: "How do I list a product for sale?",
    answer: "After logging in, click on 'Sell' in the navigation menu. Fill in your product details, upload photos, set a price, and publish your listing."
  },
  {
    id: 3,
    question: "Is it free to sell on SellKoro?",
    answer: "Yes, listing products is completely free. We only charge a small commission when your item sells successfully."
  },
  {
    id: 4,
    question: "How do I contact a seller?",
    answer: "Click on the product you're interested in, then click 'Send Message to Seller' or view their contact information from the product page."
  },
  {
    id: 5,
    question: "How do I edit or delete my listing?",
    answer: "Go to 'My Products' from your profile dropdown, find your listing, and click 'Edit' or 'Delete'."
  },
  {
    id: 6,
    question: "How do I change my password?",
    answer: "Go to 'My Profile', click on the 'Change Password' tab, enter your current password and new password, then save."
  },
  {
    id: 7,
    question: "What payment methods are accepted?",
    answer: "Sellers on SellKoro accept various payment methods including cash on delivery, bank transfer, bKash, Nagad, and Rocket."
  },
  {
    id: 8,
    question: "How do I report a suspicious listing?",
    answer: "Click on 'Report an Issue' from the footer, provide the product link and reason for reporting. Our team will review it."
  }
];

const helpTopics = [
  { title: "Getting Started", icon: "🚀", description: "Learn how to create an account and start using SellKoro" },
  { title: "Buying", icon: "🛒", description: "Tips for buying products safely on SellKoro" },
  { title: "Selling", icon: "💰", description: "How to list and sell your products successfully" },
  { title: "Account & Settings", icon: "⚙️", description: "Manage your profile, password, and preferences" },
  { title: "Payments", icon: "💳", description: "Payment methods, processing, and security" },
  { title: "Safety & Security", icon: "🛡️", description: "Stay safe while buying and selling online" }
];

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Help Center</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Find answers to common questions and learn how to make the most of SellKoro
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Help Topics Grid */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Browse Help Topics</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((topic, index) => (
              <div key={index} className="p-6 transition-all bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full">
                  <span className="text-2xl">{topic.icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">{topic.title}</h3>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 bg-blue-600">
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No results found. Try a different search term.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="p-4">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="font-semibold text-gray-800">{faq.question}</span>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === faq.id && (
                    <div className="pl-4 mt-3 border-l-2 border-blue-600">
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div className="p-6 mt-8 text-center border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">Still need help?</h3>
          <p className="mb-4 text-gray-600">Our support team is here to assist you</p>
          <Link
            href="/pages/sellKoro/contact"
            className="inline-block px-6 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}