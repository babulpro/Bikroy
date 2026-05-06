// src/app/pages/user/addresses/AddressForm.jsx
'use client';

import { useState } from 'react';

// Validation patterns
const VALIDATION = {
  country: /^[a-zA-Z\s\-']{2,50}$/,
  state: /^[a-zA-Z\s\-']{2,50}$/,
  city: /^[a-zA-Z\s\-']{2,50}$/,
  area: /^[a-zA-Z0-9\s\-',.]{2,100}$/,
  latitude: /^-?\d{1,3}\.\d{1,10}$/,
  longitude: /^-?\d{1,3}\.\d{1,10}$/,
};

const sanitizeInput = (input) => {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '').substring(0, 100);
};

export default function AddressForm({ onAddressAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    area: '',
    latitude: '',
    longitude: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'country':
        if (!value.trim()) return 'Country is required';
        if (!VALIDATION.country.test(value)) return 'Country must be 2-50 letters';
        return '';
      case 'city':
        if (!value.trim()) return 'City is required';
        if (!VALIDATION.city.test(value)) return 'City must be 2-50 letters';
        return '';
      case 'area':
        if (!value.trim()) return 'Area is required';
        if (!VALIDATION.area.test(value)) return 'Area must be 2-100 characters';
        if (/<script|javascript:|onclick|onerror/i.test(value)) return 'Invalid characters detected';
        return '';
      case 'latitude':
        if (value && !VALIDATION.latitude.test(value)) return 'Enter valid latitude (e.g., 23.8103)';
        return '';
      case 'longitude':
        if (value && !VALIDATION.longitude.test(value)) return 'Enter valid longitude (e.g., 90.4125)';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [name]: sanitized }));
    
    const error = validateField(name, sanitized);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.area) newErrors.area = 'Area is required';
    
    setErrors(newErrors);
    setTouched({ country: true, city: true, area: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/user/Address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          country: formData.country.trim(),
          state: formData.state.trim(),
          city: formData.city.trim(),
          area: formData.area.trim(),
          latitude: formData.latitude || null,
          longitude: formData.longitude || null
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        resetForm();
        onAddressAdded?.();
        window.location.reload(); // Refresh to show new address
      } else {
        alert(data.msg || 'Failed to save address');
      }
    } catch (error) {
      console.error('Save address error:', error);
      alert('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ country: '', state: '', city: '', area: '', latitude: '', longitude: '' });
    setErrors({});
    setTouched({});
    setShowForm(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
        },
        () => alert('Unable to get your location. Please enter manually.')
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 mb-6 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Address
        </button>
      ) : (
        <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Add New Address</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    showError('country') ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Bangladesh"
                  maxLength={50}
                />
                {showError('country') && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">State/Division</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dhaka"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    showError('city') ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Dhaka"
                  maxLength={50}
                />
                {showError('city') && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    showError('area') ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Gulshan"
                  maxLength={100}
                />
                {showError('area') && <p className="mt-1 text-sm text-red-500">{errors.area}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="23.8103"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="90.4125"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={getCurrentLocation} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Use Current Location</span>
              </button>

              <div className="flex space-x-3">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg text-slate-700 hover:bg-blue-700 disabled:bg-gray-400">
                  {submitting ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}