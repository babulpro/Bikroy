// src/app/pages/safety-tips/page.jsx
'use client';

const safetyTips = [
  {
    title: "Meet in Safe Public Places",
    icon: "🏢",
    description: "Always meet buyers/sellers in well-lit, public locations like shopping malls, coffee shops, or police station parking lots.",
    tips: [
      "Avoid meeting at your home or private residence",
      "Bring a friend or family member if possible",
      "Inform someone about your meeting location and time"
    ]
  },
  {
    title: "Verify Before You Pay",
    icon: "💰",
    description: "Never send money before receiving the item. Inspect the product thoroughly before making payment.",
    tips: [
      "Test electronics before buying",
      "Check for damages or defects",
      "Get a receipt or proof of purchase"
    ]
  },
  {
    title: "Use Secure Payment Methods",
    icon: "💳",
    description: "Use trusted payment methods that offer buyer protection. Avoid wire transfers or untraceable payments.",
    tips: [
      "Use cash on delivery when possible",
      "Avoid sending advance payments",
      "Use bKash, Nagad, or bank transfers with verification"
    ]
  },
  {
    title: "Verify Seller Identity",
    icon: "🆔",
    description: "Check seller ratings, reviews, and account history before making a purchase.",
    tips: [
      "Look at seller's profile and ratings",
      "Read reviews from previous buyers",
      "Ask for additional photos or videos"
    ]
  },
  {
    title: "Beware of Scams",
    icon: "⚠️",
    description: "Be cautious of deals that seem too good to be true or sellers who pressure you to act quickly.",
    tips: [
      "Never share personal financial information",
      "Avoid deals that require upfront fees",
      "Report suspicious listings immediately"
    ]
  },
  {
    title: "Keep Communication on Platform",
    icon: "💬",
    description: "Use SellKoro's messaging system to keep records of all communications.",
    tips: [
      "Avoid moving to unverified external chat apps",
      "Save all conversations as evidence",
      "Report abusive or suspicious messages"
    ]
  }
];

export default function SafetyTipsPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Safety Tips</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Your safety is our priority. Follow these tips to ensure a secure buying and selling experience.
          </p>
        </div>

        {/* Emergency Alert */}
        <div className="p-4 mb-8 border-l-4 border-yellow-400 rounded-lg bg-yellow-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                If you encounter any suspicious activity or feel unsafe, report it immediately to our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Tips Grid */}
        <div className="grid grid-cols-1 gap-6 mb-12 lg:grid-cols-2">
          {safetyTips.map((tip, index) => (
            <div key={index} className="overflow-hidden transition-all bg-white rounded-lg shadow-lg hover:shadow-xl">
              <div className="flex items-center px-6 py-3 space-x-3 bg-blue-600">
                <span className="text-2xl">{tip.icon}</span>
                <h2 className="text-lg font-semibold text-white">{tip.title}</h2>
              </div>
              <div className="p-5">
                <p className="mb-4 text-gray-700">{tip.description}</p>
                <ul className="space-y-2">
                  {tip.tips.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Report Section */}
        <div className="p-8 text-center text-white bg-blue-600 rounded-lg shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">Seen Something Suspicious?</h2>
          <p className="mb-6 opacity-90">Help keep our community safe by reporting suspicious activities</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/pages/sellKoro/report"
              className="inline-block px-6 py-2 font-semibold text-blue-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-300"
            >
              Report an Issue
            </a>
            <a
              href="/pages/sellKoro/contact"
              className="inline-block px-6 py-2 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}