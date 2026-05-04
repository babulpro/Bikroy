// src/app/pages/user/login/page.jsx
'use client';

import LoginForm from '@/components/login/LoginForm';
import { Suspense } from 'react'; 

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="max-w-md px-4 mx-auto text-center sm:px-6 lg:px-8">
          <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}