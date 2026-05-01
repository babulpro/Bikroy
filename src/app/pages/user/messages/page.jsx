// src/app/pages/user/messages/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Scroll to bottom only when new message is sent or received
  useEffect(() => {
    if (shouldAutoScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, shouldAutoScroll]);

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

  const fetchMessages = async (userId, productId) => {
    try {
      const response = await fetch(`/api/message?userId=${userId}&productId=${productId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
        // Auto-scroll to bottom after loading messages
        setShouldAutoScroll(true);
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.user.id, conversation.product.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setShouldAutoScroll(true); // Enable auto-scroll for new message
    
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          text: newMessage,
          receiverId: selectedConversation.user.id,
          productId: selectedConversation.product.id
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNewMessage('');
        setMessages(prev => [...prev, data.data]);
        
        // Update conversation last message
        setConversations(prev => prev.map(conv => 
          conv.user.id === selectedConversation.user.id && conv.product.id === selectedConversation.product.id
            ? { 
                ...conv, 
                lastMessage: newMessage, 
                lastMessageTime: new Date().toISOString(),
                lastMessageSender: 'You'
              }
            : conv
        ));
      } else {
        alert(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      alert('Something went wrong');
    } finally {
      setSending(false);
    }
  };

  // Handle scroll to detect if user scrolled up manually
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
    setShouldAutoScroll(isAtBottom);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
          <p className="mt-2 text-gray-600">Chat with buyers and sellers</p>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[650px]">
            {/* Conversations List */}
            <div className="overflow-y-auto border-r border-gray-200">
              <div className="sticky top-0 p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-800">Conversations</h2>
              </div>
              
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mb-2 text-4xl">💬</div>
                  <p className="text-gray-500">No messages yet</p>
                  <Link href="/pages/product/all-products" className="inline-block mt-4 text-blue-600 hover:underline">
                    Start shopping →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {conversations.map((conv, index) => (
                    <button
                      key={index}
                      onClick={() => handleConversationClick(conv)}
                      className={`w-full p-4 text-left hover:bg-blue-50 transition-colors ${
                        selectedConversation?.user.id === conv.user.id && 
                        selectedConversation?.product.id === conv.product.id
                          ? 'bg-blue-50'
                          : ''
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
                            <p className="font-semibold text-gray-800 truncate">
                              {conv.user.name}
                            </p>
                            <p className="ml-2 text-xs text-gray-400">
                              {formatDate(conv.lastMessageTime)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.lastMessageSender}: {conv.lastMessage}
                          </p>
                          <p className="mt-1 text-xs text-gray-400 truncate">
                            📦 {conv.product.name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col h-[650px]">
              {selectedConversation ? (
                <>
                  {/* Chat Header - Fixed at top */}
                  <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <span className="font-semibold text-blue-600">
                            {selectedConversation.user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {selectedConversation.user.name}
                          </p>
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

                  {/* Messages Container - Scrollable middle section */}
                  <div 
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 p-4 space-y-3 overflow-y-auto"
                  >
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="mb-2 text-4xl">💬</div>
                          <p className="text-gray-500">No messages yet. Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
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
                              <p className={`text-xs mt-1 ${
                                msg.isOwn ? 'text-blue-200' : 'text-gray-400'
                              }`}>
                                {formatMessageTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Message Input - Fixed at bottom */}
                  <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSendMessage}>
                      <div className="flex py-10 space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          disabled={sending || !newMessage.trim()}
                          className="flex items-center px-4 py-2 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {sending ? (
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          )}
                          <span>Send</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="mb-4 text-6xl">💬</div>
                    <p className="text-gray-500">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}