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
      title: 'About SellKoro',
      links: [
        { href: '/pages/sellKoro/about', label: 'About Us' },
        { href: '/pages/sellKoro/contact', label: 'Contact Us' },
        { href: '/pages/sellKoro/careers', label: 'Careers' },
        { href: '/pages/sellKoro/press', label: 'Press' },
      ],
    },
    { 
      title: 'Support',
      links: [
        { href: '/pages/sellKoro/help', label: 'Help Center' },
        { href: '/pages/sellKoro/safety-tips', label: 'Safety Tips' },
        { href: '/pages/sellKoro/report', label: 'Report an Issue' },
        { href: '/pages/sellKoro/terms', label: 'Terms of Service' },
      ],
    },
    {
      title: 'Sell & Buy',
      links: [
        { href: '/pages/sellKoro/sell', label: 'How to Sell' },
        { href: '/pages/sellKoro/buy', label: 'How to Buy' },
        { href: '/pages/sellKoro/payment', label: 'Payment Methods' },
        { href: '/pages/sellKoro/shipping', label: 'Shipping Info' },
      ],
    },
    {
      title: 'Follow Us',
      links: [
        { href: '/pages/sellKoro/facebook', label: 'Facebook', external: true },
        { href: '/pages/sellKoro/twitter', label: 'Twitter', external: true },
        { href: '/pages/sellKoro/instagram', label: 'Instagram', external: true },
        { href: '/pages/sellKoro/linkedin', label: 'LinkedIn', external: true },
      ],
    },
  ];

  return (
    <footer className="mt-auto text-blue-100 bg-blue-900">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-lg font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-200 transition-colors hover:text-yellow-300"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        href={link.href} 
                        className="text-blue-200 transition-colors hover:text-yellow-300"
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

        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">SellKoro</span>
            <span className="text-blue-300">.com</span>
            <span className="ml-4 text-blue-300">© {year} All rights reserved</span>
          </div>

          <div className="flex space-x-4">
            <a href="#" className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-800 rounded-lg hover:bg-blue-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.523 15.3414C17.129 16.2885 16.7189 17.024 16.2971 17.5409C15.7184 18.2573 15.2683 18.4975 14.5028 18.4975C13.7373 18.4975 13.2537 18.2451 12.5537 17.5491C11.8538 16.8531 10.9511 15.4271 10.5219 14.347C10.0927 13.2669 9.85251 12.0668 9.85251 10.8527C9.85251 8.85477 10.7269 7.17263 11.7821 6.12087C12.8373 5.06911 14.0256 4.85254 14.8943 4.85254C15.6644 4.85254 16.3132 5.33492 16.7349 6.2659C17.0916 7.03596 16.9864 7.96355 16.4077 8.87971C16.1082 9.36581 15.5622 9.95921 15.5622 10.6285C15.5622 11.2137 15.9989 11.7156 16.6692 12.1431C17.1916 12.4797 17.8128 12.8309 18.0865 13.3486C18.4125 13.9705 18.0762 14.7491 17.523 15.3414Z" />
              </svg>
              <span>App Store</span>
            </a>
            <a href="#" className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-800 rounded-lg hover:bg-blue-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12L3.609 22.186C3.092 21.974 2.666 21.548 2.454 21.031V2.969C2.666 2.452 3.092 2.026 3.609 1.814Z M14.752 12.951L4.754 22.947L14.752 12.951Z M20.391 7.536L14.752 13.176L14.752 10.824L20.391 7.536Z M5.5 21.5L14.752 13.176L14.752 10.824L5.5 2.5C4.5 3 4.5 3 4.5 3L14.5 12L5.5 21Z" />
              </svg>
              <span>Google Play</span>
            </a>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-blue-800">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-300">
            <span className="transition-colors cursor-pointer hover:text-yellow-300">🔒 Secure Payments</span>
            <span className="transition-colors cursor-pointer hover:text-yellow-300">🛡️ Buyer Protection</span>
            <span className="transition-colors cursor-pointer hover:text-yellow-300">✅ Verified Sellers</span>
            <span className="transition-colors cursor-pointer hover:text-yellow-300">🚚 Free Shipping on selected items</span>
          </div>
        </div>
      </div>
    </footer>
  );
}