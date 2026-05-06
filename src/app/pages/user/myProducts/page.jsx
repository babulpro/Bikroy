// src/app/pages/user/myProducts/page.jsx
import UserProductList from '@/components/user/userProductList/userProductList';
import { Suspense } from 'react'; 
import { React } from 'react';

export const metadata = {
  title: 'My Products | SellKoro',
  description: 'Manage your product listings. Edit, activate, deactivate, or delete your products on SellKoro.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function MyProductsPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
              <p className="mt-2 text-gray-600">Manage your listed products</p>
            </div>
            <a
              href="/pages/product/item/addProduct"
              className="flex items-center px-5 py-2 mt-4 space-x-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg sm:mt-0 hover:bg-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Product</span>
            </a>
          </div>
        </div>

        <Suspense fallback={<div className="py-12 text-center">Loading your products...</div>}>
          <UserProductList />
        </Suspense>
      </div>
    </div>
  );
}