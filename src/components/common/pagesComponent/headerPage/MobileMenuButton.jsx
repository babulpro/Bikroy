// src/components/layout/MobileMenuButton.jsx
'use client';

export default function MobileMenuButton({ isOpen, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="p-2 text-white transition-colors rounded-lg mobile-menu-button md:hidden hover:bg-blue-700"
      aria-label="Toggle menu"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}