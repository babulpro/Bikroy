// src/app/pages/product/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link'; 
import MessageModal from '@/components/message/messageModel';

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
      setIsLoggedIn(response.ok);
    } catch (error) {
      setIsLoggedIn(false);
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
  
  const sellerPhone = product.contactPhone || product.user?.phone;
  const sellerEmail = product.contactEmail || product.user?.email;
  const sellerName = product.user?.name || 'Seller';
  const isOwnProduct = product.userId === product.user?.id;

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/pages/product/categories" className="hover:text-blue-600">Categories</Link>
          <span className="mx-2">/</span>
          <Link href={`/pages/product/category/${product.categoryId}`} className="hover:text-blue-600">
            {product.category?.name || 'Products'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        {/* Message Sent Success Notification */}
        {messageSent && (
          <div className="fixed z-50 top-24 right-4 animate-slide-in">
            <div className="flex items-center px-4 py-3 space-x-2 text-green-700 bg-green-100 border border-green-400 rounded-lg shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Message sent successfully!</span>
            </div>
          </div>
        )}

        {/* Product Main Section */}
        <div className="mb-8 overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-2">
            {/* Product Images Gallery */}
            <div>
              <div className="mb-4 overflow-hidden bg-gray-100 rounded-lg">
                <img
                  src={selectedImage || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="object-contain w-full h-96"
                />
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`border-2 rounded-lg overflow-hidden hover:border-blue-500 transition-colors ${
                        selectedImage === img ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`${product.name} - ${index + 1}`} className="object-cover w-full h-20" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${conditionBadge.color}`}>
                  {conditionBadge.label}
                </span>
                {product.isFeatured && (
                  <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Featured</span>
                )}
                {product.isBoosted && (
                  <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">Boosted</span>
                )}
                {product.status !== 'ACTIVE' && (
                  <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">{product.status}</span>
                )}
              </div>

              <h1 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">{product.name}</h1>

              {product.type && (
                <p className="mb-4 text-gray-500">
                  <span className="font-medium">Type:</span> {product.type}
                </p>
              )}

              <div className="mb-6">
                <span className="text-3xl font-bold text-blue-600 md:text-4xl">
                  {product.currency === 'BDT' ? '৳' : product.currency === 'USD' ? '$' : '€'}
                  {product.price.toLocaleString()}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">Description</h3>
                <p className="leading-relaxed text-gray-600">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isOwnProduct && isLoggedIn && (
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex items-center justify-center w-full py-3 space-x-2 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Send Message to Seller</span>
                  </button>
                )}

                {!isLoggedIn && (
                  <Link
                    href="/pages/user/login"
                    className="flex items-center justify-center w-full py-3 space-x-2 font-semibold text-center text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login to Send Message</span>
                  </Link>
                )}

                <button
                  onClick={handleContactSeller}
                  className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {showContact ? 'Hide Contact Info' : 'Show Contact Info'}
                </button>
              </div>

              {/* Seller Contact Info */}
              {showContact && (
                <div className="p-4 mt-4 space-y-3 rounded-lg bg-gray-50">
                  <h4 className="flex items-center justify-between font-semibold text-gray-800">
                    Seller Information
                    <button onClick={() => setShowContact(false)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Seller Name</p>
                      <p className="font-medium text-gray-800">{sellerName}</p>
                    </div>
                    
                    {sellerPhone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <div className="flex items-center space-x-2">
                          <a href={`tel:${sellerPhone}`} className="font-medium text-blue-600 hover:underline">
                            {sellerPhone}
                          </a>
                          <button onClick={() => copyToClipboard(sellerPhone)} className="text-gray-400 hover:text-blue-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                        {copySuccess === 'Copied!' && <p className="mt-1 text-xs text-green-600">Copied to clipboard!</p>}
                      </div>
                    )}
                    
                    {sellerEmail && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href={`mailto:${sellerEmail}`} className="text-blue-600 hover:underline">{sellerEmail}</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mb-8 overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-gray-700">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Condition:</span>
                    <span className="font-medium text-gray-800">{conditionBadge.label}</span>
                  </p>
                  <p className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium text-gray-800">{product.category?.name || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-gray-800">{product.type || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium text-gray-800">{product.status}</span>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-gray-700">Listing Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Posted on:</span>
                    <span className="font-medium text-gray-800">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Last updated:</span>
                    <span className="font-medium text-gray-800">{new Date(product.updatedAt).toLocaleDateString()}</span>
                  </p>
                  <p className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Views:</span>
                    <span className="font-medium text-gray-800">{product.viewCount || 0} times</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button onClick={() => router.back()} className="flex-1 py-3 font-semibold text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300">
            Go Back
          </button>
          <Link href={`/pages/product/categories/${product.categoryId}`} className="flex-1 py-3 font-semibold text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            Browse More in {product.category?.name || 'This Category'}
          </Link>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          product={product}
          seller={product.user}
          onClose={() => setShowMessageModal(false)}
          onSend={handleMessageSent}
        />
      )}
    </div>
  );
}