// src/app/pages/product/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link'; 
import MessageModal from '@/components/message/ConversationsList';

export default function ProductByIdPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params; 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
      checkAuthStatus();
    }
  }, [id]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setCurrentUserId(data.user?.id); 
      } else {
        setIsLoggedIn(false);
        setCurrentUserId(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
      setCurrentUserId(null);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product/allProduct/productById?productId=${id}`);
      const data = await response.json();  

      if (data.success) {
        setProduct(data.data);
        const firstImage = data.data.image1 || data.data.image2 || data.data.image3 || data.data.image4 || data.data.image5;
        setSelectedImage(firstImage);
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConditionBadge = (condition) => {
    const conditions = {
      NEW: { label: 'New', color: 'bg-green-100 text-green-800' },
      LIKE_NEW: { label: 'Like New', color: 'bg-blue-100 text-blue-800' },
      GOOD: { label: 'Good', color: 'bg-yellow-100 text-yellow-800' },
      FAIR: { label: 'Fair', color: 'bg-orange-100 text-orange-800' },
      POOR: { label: 'Poor', color: 'bg-red-100 text-red-800' }
    };
    return conditions[condition] || { label: condition, color: 'bg-gray-100 text-gray-800' };
  };

  const getAllImages = () => {
    const images = [];
    if (product?.image1) images.push(product.image1);
    if (product?.image2) images.push(product.image2);
    if (product?.image3) images.push(product.image3);
    if (product?.image4) images.push(product.image4);
    if (product?.image5) images.push(product.image5);
    return images;
  };

  const getLocationName = () => {
    const parts = [];
    if (product?.district) parts.push(product.district);
    if (product?.thana) parts.push(product.thana);
    if (product?.division) parts.push(product.division);
    return parts.join(', ');
  };

  const handleContactSeller = () => {
    setShowContact(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const handleMessageSent = () => {
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-12 text-center bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Product Not Found</h3>
            <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="inline-block px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const conditionBadge = getConditionBadge(product.condition);
  const allImages = getAllImages();
  const locationName = getLocationName();
  
  const sellerPhone = product.contactPhone || product.user?.phone;
  const sellerEmail = product.contactEmail || product.user?.email;
  const sellerName = product.user?.name || 'Seller';
  const sellerId = product.user?.id || product.userId;
  
  const isOwnProduct = currentUserId && product.userId === currentUserId;
  
  return (
    <div className="min-h-screen py-6 sm:py-8 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Breadcrumb - Mobile Responsive */}
        <div className="flex flex-wrap items-center gap-1 mb-4 text-xs text-gray-600 sm:text-sm">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/pages/product/categories" className="hover:text-blue-600">Categories</Link>
          <span className="text-gray-400">/</span>
          <Link href={`/pages/product/category/${product.categoryId}`} className="hover:text-blue-600 line-clamp-1 max-w-[120px] sm:max-w-none">
            {product.category?.name || 'Products'}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 line-clamp-1">{product.name}</span>
        </div>

        {/* Message Sent Success Notification */}
        {messageSent && (
          <div className="fixed z-50 top-20 right-2 sm:top-24 sm:right-4 animate-slide-in">
            <div className="flex items-center px-3 py-2 space-x-2 text-green-700 bg-green-100 border border-green-400 rounded-lg shadow-lg sm:px-4 sm:py-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs sm:text-sm">Message sent successfully!</span>
            </div>
          </div>
        )}

        {/* Product Main Section */}
        <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-xl sm:mb-8">
          <div className="flex flex-col gap-4 p-4 sm:gap-8 sm:p-6 lg:flex-row">
            {/* Product Images Gallery */}
            <div className="lg:w-1/2">
              <div className="overflow-hidden bg-gray-100 rounded-lg">
                <img
                  src={selectedImage || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="object-contain w-full h-64 sm:h-80 lg:h-96"
                />
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-5 gap-1 mt-2 sm:gap-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`border-2 rounded-lg overflow-hidden hover:border-blue-500 transition-colors ${
                        selectedImage === img ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`${product.name} - ${index + 1}`} className="object-cover w-full h-16 sm:h-20" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2">
              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-3 sm:gap-2 sm:mb-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${conditionBadge.color}`}>
                  {conditionBadge.label}
                </span>
                {product.isFeatured && (
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Featured</span>
                )}
                {product.isBoosted && (
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">Boosted</span>
                )}
                {product.status !== 'ACTIVE' && (
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-red-800 bg-red-100 rounded-full">{product.status}</span>
                )}
              </div>

              <h1 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl line-clamp-2">{product.name}</h1>

              {product.type && (
                <p className="mb-2 text-xs text-gray-500 sm:text-sm">
                  <span className="font-medium">Type:</span> {product.type}
                </p>
              )}

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-blue-600 sm:text-3xl md:text-4xl">
                  {product.currency === 'BDT' ? '৳' : product.currency === 'USD' ? '$' : '€'}
                  {product.price.toLocaleString()}
                </span>
              </div>

              {/* Location */}
              {locationName && (
                <div className="flex items-center gap-1 mb-3 text-xs text-gray-500 sm:text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{locationName}</span>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <h3 className="mb-1 text-sm font-semibold text-gray-800 sm:text-base">Description</h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm line-clamp-4">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {isLoggedIn && !isOwnProduct && (
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-semibold text-white transition-colors bg-green-600 rounded-lg sm:py-3 hover:bg-green-700"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Send Message to Seller</span>
                  </button>
                )}

                {!isLoggedIn && (
                  <Link
                    href="/pages/user/login"
                    className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-semibold text-center text-white transition-colors bg-green-600 rounded-lg sm:py-3 hover:bg-green-700"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login to Send Message</span>
                  </Link>
                )}

                <button
                  onClick={handleContactSeller}
                  className="w-full py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg sm:py-3 hover:bg-blue-700"
                >
                  {showContact ? 'Hide Contact Info' : 'Show Contact Info'}
                </button>
              </div>

              {/* Seller Contact Info */}
              {showContact && (
                <div className="p-3 mt-3 space-y-2 rounded-lg sm:p-4 sm:mt-4 bg-gray-50">
                  <h4 className="flex items-center justify-between text-sm font-semibold text-gray-800 sm:text-base">
                    Seller Information
                    <button onClick={() => setShowContact(false)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </h4>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 sm:text-sm">Seller Name</p>
                      <p className="text-sm font-medium text-gray-800 sm:text-base">{sellerName}</p>
                    </div>
                    
                    {sellerPhone && (
                      <div>
                        <p className="text-xs text-gray-500 sm:text-sm">Phone Number</p>
                        <div className="flex items-center space-x-2">
                          <a href={`tel:${sellerPhone}`} className="text-sm font-medium text-blue-600 sm:text-base hover:underline">
                            {sellerPhone}
                          </a>
                          <button onClick={() => copyToClipboard(sellerPhone)} className="text-gray-400 hover:text-blue-600">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                        {copySuccess === 'Copied!' && <p className="mt-1 text-xs text-green-600">Copied to clipboard!</p>}
                      </div>
                    )}
                    
                    {sellerEmail && (
                      <div>
                        <p className="text-xs text-gray-500 sm:text-sm">Email</p>
                        <a href={`mailto:${sellerEmail}`} className="text-sm text-blue-600 break-all sm:text-base hover:underline">
                          {sellerEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-xl sm:mb-8">
          <div className="px-4 py-3 border-b border-gray-200 sm:px-6 sm:py-4">
            <h2 className="text-base font-bold text-gray-800 sm:text-xl">Product Details</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 sm:text-base">Basic Information</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="flex justify-between py-1 border-b border-gray-100 sm:py-2">
                    <span className="text-gray-500">Condition:</span>
                    <span className="font-medium text-gray-800">{conditionBadge.label}</span>
                  </p>
                  <p className="flex justify-between py-1 border-b border-gray-100 sm:py-2">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium text-gray-800">{product.category?.name || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between py-1 border-b border-gray-100 sm:py-2">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-gray-800">{product.type || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between py-1 border-b border-gray-100 sm:py-2">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium text-gray-800">{product.status}</span>
                  </p>
                  {locationName && (
                    <p className="flex justify-between py-1 border-b border-gray-100 sm:py-2">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium text-right text-gray-800">{locationName}</span>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 sm:text-base">Listing Information</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="flex justify-between py-1 border-b border-gray-100 sm:py-2">
                    <span className="text-gray-500">Posted on:</span>
                    <span className="font-medium text-gray-800">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="flex justify-between py-1 border-b border-gray-100 sm:py-2">
                    <span className="text-gray-500">Last updated:</span>
                    <span className="font-medium text-gray-800">{new Date(product.updatedAt).toLocaleDateString()}</span>
                  </p>
                  <p className="flex justify-between py-1 border-b border-gray-100 sm:py-2">
                    <span className="text-gray-500">Views:</span>
                    <span className="font-medium text-gray-800">{product.viewCount || 0} times</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sm:gap-4">
          <button onClick={() => router.back()} className="flex-1 py-2 text-sm font-semibold text-gray-700 transition-colors bg-gray-200 rounded-lg sm:py-3 hover:bg-gray-300">
            Go Back
          </button>
          <Link href={`/pages/product/categories/${product.categoryId}`} className="flex-1 py-2 text-sm font-semibold text-center text-white transition-colors bg-blue-600 rounded-lg sm:py-3 hover:bg-blue-700">
            Browse More
          </Link>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          product={product}
          seller={product.user || { id: product.userId, name: sellerName }}
          onClose={() => setShowMessageModal(false)}
          onSend={handleMessageSent}
        />
      )}
    </div>
  );
}