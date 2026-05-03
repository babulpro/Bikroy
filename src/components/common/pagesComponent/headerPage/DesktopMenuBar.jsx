// src/components/layout/DesktopNav.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileDropdown from './Profile';
 

export default function DesktopNav({ navLinks, isLoggedIn, user, loading, onLogout }) {
  const pathname = usePathname();

  return (
    <div className="items-center hidden space-x-4 lg:space-x-6 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition-colors hover:text-yellow-300 text-sm lg:text-base ${
            pathname === link.href ? 'text-yellow-300 font-semibold' : 'text-white'
          }`}
        >
          {link.label}
        </Link>
      ))}

      {!loading && (
        isLoggedIn ? (
          <ProfileDropdown user={user} onLogout={onLogout} />
        ) : (
          <div className="flex items-center space-x-3">
            <Link href="/pages/user/login" className="text-sm text-white transition-colors hover:text-yellow-300 lg:text-base">Login</Link>
            <Link href="/pages/user/register" className="bg-yellow-400 text-blue-700 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-sm lg:text-base">Register</Link>
          </div>
        )
      )}
    </div>
  );
}