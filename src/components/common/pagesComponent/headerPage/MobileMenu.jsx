// src/components/layout/MobileMenu.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileMenu({ isOpen, onClose, navLinks, isLoggedIn, user, onLogout }) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4 py-4 border-t border-blue-500 max-h-[calc(100vh-100px)] overflow-y-auto">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className={`block py-2.5 transition-colors hover:text-yellow-300 ${
            pathname === link.href ? 'text-yellow-300 font-semibold' : 'text-white'
          }`}
        >
          {link.label}
        </Link>
      ))}
      
      {isLoggedIn ? (
        <>
          <hr className="my-2 border-blue-500" />
          <Link href="/pages/user/profile" onClick={onClose} className="block py-2.5 text-white hover:text-yellow-300">My Profile</Link>
          <Link href="/pages/user/myProducts" onClick={onClose} className="block py-2.5 text-white hover:text-yellow-300">My Products</Link>
          <Link href="/pages/user/address" onClick={onClose} className="block py-2.5 text-white hover:text-yellow-300">My Address</Link>
          <Link href="/favorites" onClick={onClose} className="block py-2.5 text-white hover:text-yellow-300">Favorites</Link>
          <Link href="/pages/user/messages" onClick={onClose} className="block py-2.5 text-white hover:text-yellow-300">Messages</Link>
          <hr className="my-2 border-blue-500" />
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="block w-full py-2.5 font-semibold text-left text-red-300 hover:text-red-200"
          >
            Logout
          </button>
        </>
      ) : (
        <div className="mt-4 space-y-2">
          <Link href="/pages/user/login" onClick={onClose} className="block w-full text-center px-4 py-2.5 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-blue-700 transition-colors">Login</Link>
          <Link href="/pages/user/register" onClick={onClose} className="block w-full text-center px-4 py-2.5 bg-yellow-400 text-blue-700 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">Register</Link>
        </div>
      )}
    </div>
  );
}