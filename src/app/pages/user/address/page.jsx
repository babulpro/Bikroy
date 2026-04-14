// components/AddressForm.jsx
'use client';

import { useState } from 'react';

export default function AddressForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    area: '',
    latitude: null,
    longitude: null
  });

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enter manually.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/user/Address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log('Address saved:', data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Country"
        value={formData.country}
        onChange={(e) => setFormData({...formData, country: e.target.value})}
        required
        className="w-full p-2 border rounded"
      />
      
      <input
        type="text"
        placeholder="State"
        value={formData.state}
        onChange={(e) => setFormData({...formData, state: e.target.value})}
        className="w-full p-2 border rounded"
      />
      
      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={(e) => setFormData({...formData, city: e.target.value})}
        required
        className="w-full p-2 border rounded"
      />
      
      <input
        type="text"
        placeholder="Area"
        value={formData.area}
        onChange={(e) => setFormData({...formData, area: e.target.value})}
        className="w-full p-2 border rounded"
      />

      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={loading}
        className="w-full p-2 text-white bg-green-500 rounded"
      >
        {loading ? 'Getting Location...' : 'Get Current Location'}
      </button>

      {formData.latitude && formData.longitude && (
        <div className="text-sm text-gray-600">
          <p>Latitude: {formData.latitude}</p>
          <p>Longitude: {formData.longitude}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-500 rounded"
      >
        Save Address
      </button>
    </form>
  );
}