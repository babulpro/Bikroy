// src/app/pages/report/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const reportCategories = [
  { value: 'suspicious_listing', label: 'Suspicious Listing', icon: '⚠️' },
  { value: 'scam', label: 'Potential Scam', icon: '🎭' },
  { value: 'fraudulent_user', label: 'Fraudulent User', icon: '👤' },
  { value: 'inappropriate_content', label: 'Inappropriate Content', icon: '🚫' },
  { value: 'copyright_infringement', label: 'Copyright Infringement', icon: '©️' },
  { value: 'fake_product', label: 'Fake/Counterfeit Product', icon: '❌' },
  { value: 'harassment', label: 'Harassment or Abuse', icon: '😡' },
  { value: 'other', label: 'Other', icon: '📝' }
];

export default function ReportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: '',
    productLink: '',
    description: '',
    evidence: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Thank you for your report. Our team will review it within 24 hours.' });
      setFormData({ category: '', productLink: '', description: '', evidence: '' });
      setLoading(false);
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Report an Issue</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="mt-4 text-gray-600">
            Help us keep SellKoro safe by reporting any suspicious or inappropriate activity
          </p>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 bg-blue-600">
            <h2 className="text-xl font-bold text-white">Report Form</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Category */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {reportCategories.map((cat) => (
                  <label
                    key={cat.value}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.category === cat.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={formData.category === cat.value}
                      onChange={handleChange}
                      className="sr-only text-slate-700"
                    />
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm text-gray-700">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Product Link */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Product Listing Link (if applicable)
              </label>
              <input
                type="url"
                name="productLink"
                value={formData.productLink}
                onChange={handleChange}
                placeholder="https://sellkoro.com/product/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Description of Issue <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Please provide detailed information about the issue..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Evidence */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Evidence (Screenshots, Messages, etc.)
              </label>
              <textarea
                name="evidence"
                rows="3"
                value={formData.evidence}
                onChange={handleChange}
                placeholder="Provide any additional evidence or context..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can also email evidence to report@sellkoro.com
              </p>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`p-3 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 transition-colors border border-gray-500 rounded-lg hover:bg-amber-300 bg-amber-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.category || !formData.description}
                className="px-6 py-2 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>

          {/* Note */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Note:</span> All reports are confidential and will be reviewed by our team.
              We may contact you for additional information if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}