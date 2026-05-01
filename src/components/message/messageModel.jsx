// src/components/message/messageModel.jsx
'use client';

import { useState } from 'react';

export default function MessageModal({ product, seller, onClose, onSend }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (!seller || !seller.id) {
      setError('Seller information not available. Please try again.');
      return;
    }

    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          text: message,
          receiverId: seller.id,
          productId: product.id
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('');
        onSend?.(data.data);
        onClose();
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Send Message to {seller?.name || 'Seller'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="p-3 mb-4 rounded-lg bg-blue-50">
            <p className="text-sm text-gray-600">About:</p>
            <p className="font-medium text-gray-800">{product?.name}</p>
            <p className="mt-1 text-sm text-gray-500">
              Price: {product?.currency === 'BDT' ? '৳' : '$'}{product?.price?.toLocaleString()}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm interested in this product. Is it still available?"
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end mt-4 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center px-4 py-2 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}