// src/components/layout/Header.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Refs for click outside detection
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Function to check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication status on mount and when route changes
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus, pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside for dropdown and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown when clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    // Close on escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pages/product/products', label: 'Products' },
    { href: '/pages/product/categories', label: 'Categories' },
    { href: '/pages/product/sell', label: 'Sell' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-blue-700 shadow-lg py-2' 
        : 'bg-blue-600 py-3 md:py-5'
    }`}>
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with Image */}
          <Link href="/" className="flex items-center space-x-2 bg-blue-900 shrink-0">
            <div className="relative h-16 w-14 ">
              <Image
                src="/sellkoro.png"
                alt="SellKoro"
                fill
                priority
                sizes="160px"
                className='object-contain'
                 
              />
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          {/* <div className="flex-1 hidden max-w-xl mx-8 md:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 text-gray-800 placeholder-gray-500 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <button className="absolute transform -translate-y-1/2 right-2 top-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div> */}

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-4 lg:space-x-6 md:flex">
            {/* {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-yellow-300 text-sm lg:text-base ${
                  pathname === link.href ? 'text-yellow-300 font-semibold' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))} */}

            {!loading && (
              isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-blue-600 bg-yellow-400 rounded-full">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <svg className={`w-4 h-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 z-50 w-64 mt-2 bg-white rounded-lg shadow-xl">
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <span className="text-lg font-semibold text-blue-600">
                              {user?.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link href="/pages/user/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </Link>
                        
                        <Link href="/pages/user/myProducts" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          My Products
                        </Link>
                        
                        <Link href="/pages/user/address" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          My Address
                        </Link>
                        
                        <Link href="/favorites" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Favorites
                        </Link>
                        
                        <Link href="/pages/user/messages" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600">
                          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Messages
                        </Link>
                      </div>
                      
                      <hr className="my-1" />
                      
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/pages/user/login" className="text-sm text-white transition-colors hover:text-yellow-300 lg:text-base">Login</Link>
                  <Link href="/pages/user/register" className="bg-yellow-400 text-blue-700 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-sm lg:text-base">Register</Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 text-white transition-colors rounded-lg mobile-menu-button md:hidden hover:bg-blue-700"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        {/* <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 text-sm text-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="absolute transform -translate-y-1/2 right-2 top-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div> */}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden mt-4 py-4   border-blue-500 max-h-[calc(100vh-100px)] overflow-y-auto">
            {/* {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2.5 transition-colors hover:text-yellow-300 ${
                  pathname === link.href ? 'text-yellow-300 font-semibold' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
             */}
            {!loading && (
              isLoggedIn ? (
                <>
                  <hr className="my-2 border-blue-500" />
                  <Link href="/pages/user/profile" onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-white hover:text-yellow-300">My Profile</Link>
                  <Link href="/pages/user/myProducts" onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-white hover:text-yellow-300">My Products</Link>
                  <Link href="/pages/user/address" onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-white hover:text-yellow-300">My Address</Link>
                  <Link href="/pages/user/favorites" onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-white hover:text-yellow-300">Favorites</Link>
                  <Link href="/pages/user/messages" onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-white hover:text-yellow-300">Messages</Link>
                  <hr className="my-2 border-blue-500" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full py-2.5 font-semibold text-left text-red-300 hover:text-red-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="mt-4 space-y-2">
                  <Link href="/pages/user/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-2.5 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-blue-700 transition-colors">Login</Link>
                  <Link href="/pages/user/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-2.5 bg-yellow-400 text-blue-700 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">Register</Link>
                </div>
              )
            )}
          </div>
        )}
      </nav>
    </header>
  );
}