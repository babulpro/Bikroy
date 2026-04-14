// src/components/layout/Footer.jsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const footerSections = [
    {
      title: 'About Bikroy',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact Us' },
        { href: '/careers', label: 'Careers' },
        { href: '/press', label: 'Press' },
      ],
    },
    {
      title: 'Support',
      links: [
        { href: '/help', label: 'Help Center' },
        { href: '/safety', label: 'Safety Tips' },
        { href: '/report', label: 'Report an Issue' },
        { href: '/terms', label: 'Terms of Service' },
      ],
    },
    {
      title: 'Sell & Buy',
      links: [
        { href: '/how-to-sell', label: 'How to Sell' },
        { href: '/how-to-buy', label: 'How to Buy' },
        { href: '/payment', label: 'Payment Methods' },
        { href: '/shipping', label: 'Shipping Info' },
      ],
    },
    {
      title: 'Follow Us',
      links: [
        { href: 'https://facebook.com', label: 'Facebook', external: true },
        { href: 'https://twitter.com', label: 'Twitter', external: true },
        { href: 'https://instagram.com', label: 'Instagram', external: true },
        { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
      ],
    },
  ];

  return (
    <footer className="bg-blue-900 text-blue-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-200 hover:text-yellow-300 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        href={link.href} 
                        className="text-blue-200 hover:text-yellow-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-8 border-blue-800" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">Bikroy</span>
            <span className="text-blue-300">.com</span>
            <span className="text-blue-300 ml-4">© {year} All rights reserved</span>
          </div>

          <div className="flex space-x-4">
            <a href="#" className="flex items-center space-x-2 bg-blue-800 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.523 15.3414C17.129 16.2885 16.7189 17.024 16.2971 17.5409C15.7184 18.2573 15.2683 18.4975 14.5028 18.4975C13.7373 18.4975 13.2537 18.2451 12.5537 17.5491C11.8538 16.8531 10.9511 15.4271 10.5219 14.347C10.0927 13.2669 9.85251 12.0668 9.85251 10.8527C9.85251 8.85477 10.7269 7.17263 11.7821 6.12087C12.8373 5.06911 14.0256 4.85254 14.8943 4.85254C15.6644 4.85254 16.3132 5.33492 16.7349 6.2659C17.0916 7.03596 16.9864 7.96355 16.4077 8.87971C16.1082 9.36581 15.5622 9.95921 15.5622 10.6285C15.5622 11.2137 15.9989 11.7156 16.6692 12.1431C17.1916 12.4797 17.8128 12.8309 18.0865 13.3486C18.4125 13.9705 18.0762 14.7491 17.523 15.3414Z" />
              </svg>
              <span>App Store</span>
            </a>
            <a href="#" className="flex items-center space-x-2 bg-blue-800 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12L3.609 22.186C3.092 21.974 2.666 21.548 2.454 21.031V2.969C2.666 2.452 3.092 2.026 3.609 1.814Z M14.752 12.951L4.754 22.947L14.752 12.951Z M20.391 7.536L14.752 13.176L14.752 10.824L20.391 7.536Z M5.5 21.5L14.752 13.176L14.752 10.824L5.5 2.5C4.5 3 4.5 3 4.5 3L14.5 12L5.5 21Z" />
              </svg>
              <span>Google Play</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-blue-800">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-300">
            <span className="hover:text-yellow-300 transition-colors cursor-pointer">🔒 Secure Payments</span>
            <span className="hover:text-yellow-300 transition-colors cursor-pointer">🛡️ Buyer Protection</span>
            <span className="hover:text-yellow-300 transition-colors cursor-pointer">✅ Verified Sellers</span>
            <span className="hover:text-yellow-300 transition-colors cursor-pointer">🚚 Free Shipping on selected items</span>
          </div>
        </div>
      </div>
    </footer>
  );
}