// src/app/pages/user/messages/ConversationsList.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ConversationsList({ isMobile = false }) {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/message/conversations', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.data);
      } else if (data.error === 'Unauthorized') {
        router.push('/pages/user/login');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="mb-4 text-5xl">💬</div>
        <p className="text-gray-500">No messages yet</p>
        <Link href="/pages/product/allProducts" className="inline-block mt-4 text-blue-600 hover:underline">
          Start shopping →
        </Link>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-[600px] overflow-y-auto">
        <div className="sticky top-0 p-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
          <p className="text-xs text-gray-500">{conversations.length} chats</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {conversations.map((conv, index) => (
            <button
              key={index}
              onClick={() => {
                localStorage.setItem('selectedConversation', JSON.stringify(conv));
                window.location.reload();
              }}
              className="w-full p-4 text-left transition-colors hover:bg-blue-50"
            >
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full">
                  <span className="text-lg font-semibold text-blue-600">
                    {conv.user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <p className="font-semibold text-gray-800 truncate">{conv.user.name}</p>
                    <p className="ml-2 text-xs text-gray-400">{formatDate(conv.lastMessageTime)}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessageSender}: {conv.lastMessage}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 truncate">📦 {conv.product.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto border-r border-gray-200">
      <div className="sticky top-0 p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-gray-800">Conversations</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {conversations.map((conv, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedId(conv.user.id);
              window.dispatchEvent(new CustomEvent('selectConversation', { detail: conv }));
            }}
            className={`w-full p-4 text-left hover:bg-blue-50 transition-colors ${
              selectedId === conv.user.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                <span className="font-semibold text-blue-600">
                  {conv.user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold text-gray-800 truncate">{conv.user.name}</p>
                  <p className="ml-2 text-xs text-gray-400">{formatDate(conv.lastMessageTime)}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conv.lastMessageSender}: {conv.lastMessage}
                </p>
                <p className="mt-1 text-xs text-gray-400 truncate">📦 {conv.product.name}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}