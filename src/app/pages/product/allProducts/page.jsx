 
import AllProductsClient from '@/components/common/pagesComponent/product/component/AllProduct';
import { Suspense } from 'react';
 

export const metadata = {
  title: 'All Products | SellKoro',
  description: 'Browse all products available on SellKoro. Find the best deals on electronics, furniture, cars, property, and more.',
};



export default function AllProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="py-12 text-center">Loading products...</div>
    </div>}>
      <AllProductsClient />
    </Suspense>
  );
}