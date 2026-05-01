// src/app/pages/user/profile/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MyProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // profile, password
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Avatar options
  const avatarOptions = [
    { id: 1, emoji: '👤', color: 'bg-blue-100', label: 'Default' },
    { id: 2, emoji: '😀', color: 'bg-green-100', label: 'Smiley' },
    { id: 3, emoji: '😎', color: 'bg-yellow-100', label: 'Cool' },
    { id: 4, emoji: '👨‍💻', color: 'bg-purple-100', label: 'Developer' },
    { id: 5, emoji: '👩‍🎨', color: 'bg-pink-100', label: 'Artist' },
    { id: 6, emoji: '🧑‍🏫', color: 'bg-indigo-100', label: 'Teacher' },
    { id: 7, emoji: '👨‍🔧', color: 'bg-orange-100', label: 'Mechanic' },
    { id: 8, emoji: '👩‍⚕️', color: 'bg-red-100', label: 'Doctor' },
    { id: 9, emoji: '🧑‍🌾', color: 'bg-green-100', label: 'Farmer' },
    { id: 10, emoji: '👨‍🍳', color: 'bg-amber-100', label: 'Chef' },
    { id: 11, emoji: '🧑‍🎄', color: 'bg-red-100', label: 'Festive' },
    { id: 12, emoji: '🐱', color: 'bg-gray-100', label: 'Cat Lover' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setProfileForm({
          name: data.user.name || '',
          email: data.user.email || '',
          avatar: data.user.avatar || '👤'
        });
      } else if (response.status === 401) {
        router.push('/pages/user/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarSelect = (avatar) => {
    setProfileForm(prev => ({ ...prev, avatar: avatar.emoji }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!profileForm.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!profileForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setUpdating(true);
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          avatar: profileForm.avatar
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        showMessage('success', 'Profile updated successfully!');
        setUser(data.user);
      } else {
        showMessage('error', data.msg || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      showMessage('error', 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setUpdating(true);
    try {
      const response = await fetch('/api/user/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        showMessage('success', 'Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showMessage('error', data.msg || 'Failed to update password');
      }
    } catch (error) {
      console.error('Update password error:', error);
      showMessage('error', 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings</p>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'password'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Profile Information</h2>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
              {/* Avatar Section */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  Profile Avatar
                </label>
                
                {/* Current Avatar Preview */}
                <div className="flex items-center mb-4 space-x-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${profileForm.avatar ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {profileForm.avatar || '👤'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Avatar</p>
                    <p className="text-xs text-gray-400">Click on any avatar below to change</p>
                  </div>
                </div>

                {/* Avatar Options Grid */}
                <div className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-12">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`w-12 h-12 rounded-full ${avatar.color} flex items-center justify-center text-2xl transition-all hover:scale-110 ${
                        profileForm.avatar === avatar.emoji
                          ? 'ring-2 ring-blue-600 ring-offset-2'
                          : ''
                      }`}
                      title={avatar.label}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Member Since */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Member since: {new Date(user?.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Role: {user?.role}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 bg-blue-600">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your current password"
                />
                {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>}
              </div>

              {/* New Password */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password (min. 6 characters)"
                />
                {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
                <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 text-slate-700 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your new password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              {/* Password Tips */}
              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="mb-2 text-sm font-semibold text-blue-800">Password Tips:</h4>
                <ul className="space-y-1 text-xs text-blue-700">
                  <li>• Use at least 6 characters</li>
                  <li>• Mix letters, numbers, and symbols</li>
                  <li>• Avoid common passwords</li>
                  <li>• Don't share your password with anyone</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}