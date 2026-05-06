// src/app/pages/user/register/page.jsx
 ;
import RegisterForm from '@/components/registration/RegistrationForm';
import { Suspense } from 'react'; 

// Metadata for SEO (can only be in Server Component)
export const metadata = {
  title: 'Create Account | SellKoro',
  description: 'Join millions of buyers and sellers on SellKoro. Create your free account today.',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="max-w-md px-4 mx-auto text-center sm:px-6 lg:px-8">
          <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}