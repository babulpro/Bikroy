// src/components/layout/Header.jsx
'use client';

import { useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../common/pagesComponent/headerPage/Logo';
import MobileMenuButton from '../common/pagesComponent/headerPage/MobileMenuButton';
import MobileMenu from '../common/pagesComponent/headerPage/MobileMenu';
import { useAuth } from '../common/pagesComponent/headerPage/UserAuthHook';
import { useScroll } from '../common/pagesComponent/headerPage/UseScroll';
import { useClickOutside } from '../common/pagesComponent/headerPage/UseClickOutside';
import DesktopNav from '../common/pagesComponent/headerPage/DesktopMenuBar';
 

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  
  const { isLoggedIn, user, loading, handleLogout } = useAuth();
  const isScrolled = useScroll(10);

  // Close mobile menu when clicking outside
  useClickOutside(mobileMenuRef, () => setIsMenuOpen(false), '.mobile-menu-button');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pages/product/allProducts', label: 'Products' },
    { href: '/pages/product/categories', label: 'Categories' },
    { href: '/pages/product/item/addProduct', label: 'Sell' },
  ];

  const onLogout = async () => {
    const success = await handleLogout();
    if (success) {
      setIsMenuOpen(false);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-blue-700 shadow-lg py-2' : 'bg-blue-600 py-3 md:py-5'
    }`}>
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <DesktopNav 
            navLinks={navLinks}
            isLoggedIn={isLoggedIn}
            user={user}
            loading={loading}
            onLogout={onLogout}
          />
          <MobileMenuButton 
            isOpen={isMenuOpen} 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
          />
        </div>

        <MobileMenu 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navLinks={navLinks}
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={onLogout}
        />
      </nav>
    </header>
  );
}