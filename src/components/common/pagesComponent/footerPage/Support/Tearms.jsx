// src/app/pages/terms/page.jsx
'use client';

import { useState } from 'react';

export default function TermsOfServicePage() {
  const [lastUpdated] = useState("January 1, 2025");

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Terms of Service</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="mt-4 text-gray-600">Last Updated: {lastUpdated}</p>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="p-6 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">1. Introduction</h2>
              <p className="leading-relaxed text-gray-700">
                Welcome to SellKoro. By accessing or using our platform, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">2. Eligibility</h2>
              <p className="mb-2 leading-relaxed text-gray-700">
                To use SellKoro, you must:
              </p>
              <ul className="ml-4 space-y-1 text-gray-700 list-disc list-inside">
                <li>Be at least 18 years old</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Provide accurate and complete registration information</li>
                <li>Not be prohibited from using our services by any applicable law</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">3. User Accounts</h2>
              <p className="mb-2 leading-relaxed text-gray-700">
                You are responsible for maintaining the confidentiality of your account credentials. 
                You agree to:
              </p>
              <ul className="ml-4 space-y-1 text-gray-700 list-disc list-inside">
                <li>Notify us immediately of any unauthorized account access</li>
                <li>Not share your account with others</li>
                <li>Be fully responsible for all activities under your account</li>
              </ul>
            </section>

            {/* Listings and Transactions */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">4. Listings and Transactions</h2>
              <p className="mb-2 leading-relaxed text-gray-700">
                When listing items for sale, you agree to:
              </p>
              <ul className="mb-2 ml-4 space-y-1 text-gray-700 list-disc list-inside">
                <li>Provide accurate and truthful information about your products</li>
                <li>Not list prohibited or illegal items</li>
                <li>Honor all transactions and complete sales in good faith</li>
                <li>Respond to buyer inquiries in a timely manner</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                SellKoro is a platform connecting buyers and sellers. We are not responsible for the quality, 
                safety, or legality of items listed, or the accuracy of listings.
              </p>
            </section>

            {/* Prohibited Items */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">5. Prohibited Items</h2>
              <p className="mb-2 leading-relaxed text-gray-700">
                The following items are strictly prohibited on SellKoro:
              </p>
              <ul className="ml-4 space-y-1 text-gray-700 list-disc list-inside">
                <li>Illegal drugs and paraphernalia</li>
                <li>Stolen goods or items without clear ownership</li>
                <li>Counterfeit or replicas</li>
                <li>Weapons, ammunition, or explosives</li>
                <li>Endangered animal products</li>
                <li>Human body parts or fluids</li>
                <li>Adult content or services</li>
              </ul>
            </section>

            {/* Fees and Payments */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">6. Fees and Payments</h2>
              <p className="leading-relaxed text-gray-700">
                Listing items on SellKoro is free. We may charge a commission fee on successful sales, 
                which will be clearly communicated before you complete a transaction. All fees are non-refundable 
                unless otherwise stated.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">7. Intellectual Property</h2>
              <p className="leading-relaxed text-gray-700">
                You retain ownership of the content you post on SellKoro. By posting content, you grant us 
                a non-exclusive license to use, display, and distribute your content on our platform. 
                You may not use our trademarks or copyrighted material without permission.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">8. Termination</h2>
              <p className="leading-relaxed text-gray-700">
                We reserve the right to suspend or terminate your account if you violate these Terms of Service, 
                engage in fraudulent activity, or misuse our platform. You may delete your account at any time.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">9. Disclaimer of Warranties</h2>
              <p className="leading-relaxed text-gray-700">
                SellKoro is provided "as is" without any warranties. We do not guarantee that our platform 
                will be error-free, secure, or uninterrupted. Your use of the platform is at your own risk.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">10. Limitation of Liability</h2>
              <p className="leading-relaxed text-gray-700">
                To the maximum extent permitted by law, SellKoro shall not be liable for any indirect, 
                incidental, or consequential damages arising from your use of our platform.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">11. Changes to Terms</h2>
              <p className="leading-relaxed text-gray-700">
                We may update these Terms of Service from time to time. Continued use of the platform after 
                changes constitutes acceptance of the new terms. Material changes will be notified via email 
                or platform notification.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="mb-3 text-xl font-bold text-gray-800">12. Contact Us</h2>
              <p className="leading-relaxed text-gray-700">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="p-4 mt-3 rounded-lg bg-gray-50">
                <p className="text-gray-700">📧 Email: legal@sellkoro.com</p>
                <p className="mt-1 text-gray-700">📍 Address: Dhaka, Bangladesh</p>
                <p className="mt-1 text-gray-700">📞 Phone: +880 1234 567890</p>
              </div>
            </section>
          </div>

          {/* Acceptance Banner */}
          <div className="px-6 py-4 border-t border-blue-200 bg-blue-50">
            <p className="text-sm text-center text-blue-800">
              By using SellKoro, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}