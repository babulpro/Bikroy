// src/app/pages/user/messages/ChatArea.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import MessageInput from './MessageInput';

export default function ChatArea() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('selectedConversation');
    if (saved) {
      const conv = JSON.parse(saved);
      setSelectedConversation(conv);
      fetchMessages(conv.user.id, conv.product.id);
      localStorage.removeItem('selectedConversation');
    }
  }, []);

  useEffect(() => {
    const handleSelect = (e) => {
      setSelectedConversation(e.detail);
      fetchMessages(e.detail.user.id, e.detail.product.id);
    };
    window.addEventListener('selectConversation', handleSelect);
    return () => window.removeEventListener('selectConversation', handleSelect);
  }, []);

  useEffect(() => {
    if (shouldAutoScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, shouldAutoScroll]);

  const fetchMessages = async (userId, productId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/message?userId=${userId}&productId=${productId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedConversation) return;

    const tempMessage = {
      text,
      isOwn: true,
      sender: { name: 'You' },
      createdAt: new Date().toISOString(),
      _temp: true
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          text,
          receiverId: selectedConversation.user.id,
          productId: selectedConversation.product.id
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessages(prev => prev.filter(m => !m._temp).concat(data.data));
      } else {
        setMessages(prev => prev.filter(m => !m._temp));
        alert(data.error || 'Failed to send message');
      }
    } catch (error) {
      setMessages(prev => prev.filter(m => !m._temp));
      console.error('Send message error:', error);
      alert('Something went wrong');
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setShouldAutoScroll(scrollHeight - scrollTop <= clientHeight + 50);
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full md:col-span-2">
        <div className="text-center">
          <div className="mb-4 text-6xl">💬</div>
          <p className="text-gray-500">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[650px] md:col-span-2">
      {/* Chat Header */}
      <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <span className="font-semibold text-blue-600">
                {selectedConversation.user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">{selectedConversation.user.name}</p>
              <Link 
                href={`/pages/product/productById/${selectedConversation.product.id}`}
                className="text-xs text-blue-600 hover:underline"
              >
                📦 {selectedConversation.product.name}
              </Link>
            </div>
          </div>
          <div className="text-sm font-semibold text-blue-600">
            ৳{selectedConversation.product.price?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-4 space-y-3 overflow-y-auto"
      >
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="mb-2 text-4xl">💬</div>
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 ${
                  msg.isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {!msg.isOwn && (
                  <p className="mb-1 text-xs font-semibold text-blue-600">
                    {msg.sender?.name}
                  </p>
                )}
                <p className="text-sm break-words">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}