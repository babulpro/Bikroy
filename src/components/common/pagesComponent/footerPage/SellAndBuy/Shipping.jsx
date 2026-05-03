// src/app/pages/shipping-info/page.jsx
'use client';

import Link from "next/link";

const shippingMethods = [
  {
    name: "Local Pickup",
    icon: "🏪",
    description: "Meet the seller in person to pick up your item.",
    details: ["Free service", "Inspect before purchase", "Instant delivery", "Pay on pickup"]
  },
  {
    name: "Same Day Delivery",
    icon: "🚴",
    description: "Fast delivery within Dhaka city on the same day.",
    details: ["Delivery within 6 hours", "Track your order", "Available in Dhaka only", "Additional fee applies"]
  },
  {
    name: "Next Day Delivery",
    icon: "🚚",
    description: "Get your item delivered within 24 hours.",
    details: ["Available in major cities", "Real-time tracking", "SMS notifications", "Suitable for urgent items"]
  },
  {
    name: "Standard Delivery",
    icon: "📦",
    description: "Regular delivery service for non-urgent items.",
    details: ["2-5 business days", "Affordable rates", "Pan Bangladesh coverage", "Tracking available"]
  },
  {
    name: "Courier Service",
    icon: "✈️",
    description: "Professional courier service for safe delivery.",
    details: ["Door-to-door service", "Insurance available", "Package tracking", "Cash on delivery option"]
  }
];

const shippingTips = [
  "Package items securely to prevent damage",
  "Use bubble wrap for fragile items",
  "Keep tracking numbers for reference",
  "Take photos of packaged items as proof",
  "Communicate clearly about delivery timelines",
  "Get delivery confirmation from the courier"
];

const deliveryZones = [
  { zone: "Dhaka Metro", coverage: "Full coverage", time: "1-2 days" },
  { zone: "Other Major Cities", coverage: "Full coverage", time: "2-3 days" },
  { zone: "District Towns", coverage: "Partial coverage", time: "3-5 days" },
  { zone: "Rural Areas", coverage: "Limited coverage", time: "5-7 days" }
];

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Shipping Information</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Learn about delivery options, costs, and timelines for your purchases.
          </p>
        </div>

        {/* Shipping Methods Grid */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {shippingMethods.map((method, index) => (
            <div key={index} className="overflow-hidden transition-all bg-white rounded-lg shadow-lg hover:shadow-xl">
              <div className="flex items-center p-4 space-x-3 bg-blue-600">
                <span className="text-2xl">{method.icon}</span>
                <h3 className="text-lg font-semibold text-white">{method.name}</h3>
              </div>
              <div className="p-5">
                <p className="mb-4 text-sm text-gray-600">{method.description}</p>
                <ul className="space-y-2">
                  {method.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Zones */}
        <div className="mb-8 overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 bg-blue-600">
            <h2 className="text-xl font-bold text-white">📍 Delivery Zones & Timelines</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">Zone</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">Coverage</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">Estimated Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deliveryZones.map((zone, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">{zone.zone}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{zone.coverage}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{zone.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Tips */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          <div className="overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">📦 Shipping Tips for Sellers</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {shippingTips.slice(0, 6).map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-700">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">💰 Shipping Costs Estimates</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">Within Dhaka (≤ 2kg)</span>
                  <span className="font-semibold text-blue-600">50-80 BDT</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">Outside Dhaka (≤ 2kg)</span>
                  <span className="font-semibold text-blue-600">100-150 BDT</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">Heavy Items (5-10kg)</span>
                  <span className="font-semibold text-blue-600">200-400 BDT</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">Cash on Delivery (COD)</span>
                  <span className="font-semibold text-blue-600">30-50 BDT extra</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">*Actual costs may vary by courier service and package dimensions</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 text-center text-white bg-blue-600 rounded-lg shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">Need Help with Shipping?</h2>
          <p className="mb-6 opacity-90">Our support team can help you choose the best shipping option</p>
          <Link
            href="/pages/sellKoro/contact"
            className="inline-block px-8 py-3 font-semibold text-blue-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-300"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}