// src/app/pages/user/messages/page.jsx
import ChatArea from '@/components/message/ChatArea';
import ConversationsList from '@/components/message/ConversationsList';
import { Suspense } from 'react';
 

export const metadata = {
  title: 'Messages | SellKoro',
  description: 'Chat with buyers and sellers. Manage your conversations about products on SellKoro.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function MessagesPage() {
  return (
    <div className="min-h-screen py-6 sm:py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-gray-600 sm:mt-2">Chat with buyers and sellers</p>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          {/* Desktop View - Split Screen */}
          <div className="hidden md:grid md:grid-cols-3 h-[650px]">
            <Suspense fallback={<div className="p-4">Loading conversations...</div>}>
              <ConversationsList />
            </Suspense>
            <Suspense fallback={<div className="p-4">Loading chat...</div>}>
              <ChatArea />
            </Suspense>
          </div>

          {/* Mobile View handled by components internally */}
          <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
            <div className="md:hidden">
              <ConversationsList isMobile />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}