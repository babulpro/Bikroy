// src/app/pages/user/addresses/AddressList.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddressList() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/user/Address', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.data || []);
      } else if (response.status === 401) {
        router.push('/pages/user/login');
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/user/Address/delete?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        await fetchAddresses();
      } else {
        alert(data.msg || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Delete address error:', error);
      alert('Something went wrong');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading addresses...</p>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-lg shadow-lg">
        <div className="mb-4 text-6xl">📍</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">No Addresses Yet</h3>
        <p className="text-gray-600">Click "Add New Address" to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {addresses.map((address) => (
        <div key={address.id} className="overflow-hidden transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl">
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">{address.city}, {address.country}</h3>
              </div>
              <button
                onClick={() => handleDelete(address.id)}
                disabled={deleting === address.id}
                className="p-1 text-gray-400 transition-colors hover:text-red-600 disabled:opacity-50"
              >
                {deleting === address.id ? (
                  <div className="w-5 h-5 border-b-2 border-red-600 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-start space-x-2">
                <span>📍</span>
                <span>{address.area}, {address.city}</span>
              </p>
              {address.state && (
                <p className="flex items-start space-x-2">
                  <span>🏛️</span>
                  <span>{address.state}</span>
                </p>
              )}
              <p className="flex items-start space-x-2">
                <span>🌍</span>
                <span>{address.country}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}