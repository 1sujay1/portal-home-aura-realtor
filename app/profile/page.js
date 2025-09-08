'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaSpinner, FaSave, FaArrowLeft } from 'react-icons/fa';
import { BiBuildingHouse } from 'react-icons/bi';
import Link from 'next/link';

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: {
      primary: '',
      secondary: ''
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: {
          primary: user.phone?.primary || '',
          secondary: user.phone?.secondary || ''
        }
      });
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('phone.')) {
      const phoneField = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        phone: {
          ...prevState.phone,
          [phoneField]: value
        }
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate primary phone is provided
    if (!formData.phone.primary.trim()) {
      setError('Primary phone number is required');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        // Update user context if needed
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050b2c] to-[#1a237e]">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffa509]"></div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b2c] to-[#1a237e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#ffa509] p-4 rounded-2xl">
                <BiBuildingHouse className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-[#050b2c]">
              Update Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Keep your profile information up to date
            </p>
          </div>

          {/* Back to Dashboard Link */}
          <div className="flex justify-start">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-[#ffa509] hover:text-[#ff9100] transition-colors"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-xl">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-8">
                  <FaUser className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-8">
                  <FaEnvelope className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Primary Phone Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Phone Number *
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-8">
                  <FaPhone className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="phone.primary"
                  name="phone.primary"
                  type="tel"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Primary Phone Number"
                  value={formData.phone.primary}
                  onChange={handleChange}
                />
              </div>

              {/* Secondary Phone Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Phone Number (Optional)
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-8">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone.secondary"
                  name="phone.secondary"
                  type="tel"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Secondary Phone Number (Optional)"
                  value={formData.phone.secondary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-[#050b2c] to-[#0a1854] hover:from-[#0a1854] hover:to-[#050b2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffa509] font-medium transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <FaSpinner className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <FaSave className="h-5 w-5 mr-2" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
