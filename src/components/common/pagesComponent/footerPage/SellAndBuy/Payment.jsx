// src/app/pages/payment-methods/page.jsx
'use client';

const paymentMethods = [
  {
    name: "Cash on Delivery (COD)",
    icon: "💵",
    color: "bg-green-100",
    description: "Pay in cash when you receive your item. Most popular and secure method.",
    features: ["Pay only when you receive the item", "No advance payment needed", "Most trusted by buyers"]
  },
  {
    name: "bKash",
    icon: "💙",
    color: "bg-blue-100",
    description: "Bangladesh's leading mobile financial service. Fast, secure, and convenient.",
    features: ["24/7 availability", "No bank account needed", "Instant transfers"]
  },
  {
    name: "Nagad",
    icon: "🧡",
    color: "bg-orange-100",
    description: "Government-approved mobile financial service with wide coverage.",
    features: ["Low transaction fees", "Easy registration", "Cash in/out at any Nagad point"]
  },
  {
    name: "Rocket",
    icon: "🚀",
    color: "bg-red-100",
    description: "Digital banking service from Dutch-Bangla Bank.",
    features: ["Secure transactions", "Bank integration", "Widely accepted"]
  },
  {
    name: "Bank Transfer",
    icon: "🏦",
    color: "bg-purple-100",
    description: "Direct bank to bank transfer. Suitable for high-value transactions.",
    features: ["Secure for large amounts", "Trackable transactions", "Bank records available"]
  },
  {
    name: "Cash in Person",
    icon: "🤝",
    color: "bg-yellow-100",
    description: "Physical cash payment during face-to-face meeting.",
    features: ["No transaction fees", "Immediate payment", "Inspect product before paying"]
  }
];

const securityTips = [
  "Never share your PIN or OTP with anyone",
  "Verify the seller's identity before paying",
  "Use escrow services for high-value items",
  "Keep transaction receipts and records",
  "Report suspicious payment requests immediately"
];

export default function PaymentMethodsPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Payment Methods</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Choose from multiple secure payment options to buy and sell with confidence.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method, index) => (
            <div key={index} className="overflow-hidden transition-all bg-white rounded-lg shadow-lg hover:shadow-xl">
              <div className={`${method.color} p-4 flex items-center space-x-3`}>
                <span className="text-3xl">{method.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{method.name}</h3>
              </div>
              <div className="p-5">
                <p className="mb-4 text-sm text-gray-600">{method.description}</p>
                <ul className="space-y-2">
                  {method.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Security Tips */}
        <div className="mb-8 overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 bg-blue-600">
            <h2 className="text-xl font-bold text-white">🔒 Payment Security Tips</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {securityTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-700">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 bg-blue-600">
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="mb-1 font-semibold text-gray-800">Is it safe to pay online?</h3>
              <p className="text-sm text-gray-600">Yes, when using trusted methods like bKash, Nagad, or Rocket. Always verify the recipient's information before sending money.</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-800">Should I pay before receiving the item?</h3>
              <p className="text-sm text-gray-600">We recommend paying only after inspecting the item. Cash on delivery is the safest option for buyers.</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-800">What if I get scammed?</h3>
              <p className="text-sm text-gray-600">Report the issue immediately through our "Report an Issue" page. Our team will investigate and take appropriate action.</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-800">Can I negotiate payment methods with the seller?</h3>
              <p className="text-sm text-gray-600">Yes, you can discuss and agree on a payment method that works for both parties before completing the transaction.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}