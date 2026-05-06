// src/app/pages/user/addresses/page.jsx
import AddressForm from '@/components/address/AddressForm';
import AddressList from '@/components/address/AddressList';
import { Suspense } from 'react';
 

export const metadata = {
  title: 'My Addresses | SellKoro',
  description: 'Manage your delivery addresses for buying and selling products on SellKoro.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AddressesPage() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">My Addresses</h1>
          <p className="mt-1 text-gray-600">Manage your delivery addresses</p>
        </div>

        <Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
          <AddressForm />
          <AddressList />
        </Suspense>
      </div>
    </div>
  );
}