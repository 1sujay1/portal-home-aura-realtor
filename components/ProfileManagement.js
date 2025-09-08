'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaSpinner, FaSave, FaEdit, FaCrown, FaClock, FaCheckCircle } from 'react-icons/fa';

export default function ProfileManagement() {
  const { user } = useAuth();
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: {
          primary: user.phone?.primary || '',
          secondary: user.phone?.secondary || ''
        }
      });
    }
  }, [user]);

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
        setIsEditing(false);
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

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: {
          primary: user.phone?.primary || '',
          secondary: user.phone?.secondary || ''
        }
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get subscription status details
  const getSubscriptionStatus = () => {
    if (!user?.subscription) {
      return {
        status: 'inactive',
        label: 'No Active Subscription',
        color: 'bg-gray-100 text-gray-800',
        icon: <FaClock className="h-5 w-5" />
      };
    }

    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    
    if (endDate < now) {
      return {
        status: 'expired',
        label: 'Subscription Expired',
        color: 'bg-red-50 text-red-700',
        icon: <FaClock className="h-5 w-5" />
      };
    }

    return {
      status: 'active',
      label: 'Active Subscription',
      color: 'bg-green-50 text-green-700',
      icon: <FaCheckCircle className="h-5 w-5" />
    };
  };

  const subscriptionStatus = getSubscriptionStatus();
  const planName = user?.subscription?.planId 
    ? user.subscription.planId.charAt(0).toUpperCase() + user.subscription.planId.slice(1)
    : 'No Plan';

  return (
    <div className="space-y-6">
      {/* Subscription Status Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${subscriptionStatus.color.includes('green') ? 'bg-green-100' : 'bg-gray-100'}`}>
              <FaCrown className="h-8 w-8 text-[#ffa509]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Subscription</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriptionStatus.color}`}>
                  {subscriptionStatus.icon}
                  {subscriptionStatus.label}
                </span>
                {user?.subscription && (
                  <span className="text-sm text-gray-600">
                    {planName} Plan • Expires {formatDate(user.subscription.endDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {subscriptionStatus.status !== 'active' && (
            <a 
              href="/subscription"
              className="px-4 py-2 bg-[#ffa509] hover:bg-[#ff9100] text-white font-medium rounded-lg transition-colors text-center"
            >
              Upgrade Now
            </a>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#050b2c]">Profile Settings</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffa509] text-white rounded-lg hover:bg-[#ff9100] transition-colors"
          >
            <FaEdit />
            Edit Profile
          </button>
        )}
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-[#ffa509]" />
              </div>
              <input
                name="name"
                type="text"
                required
                disabled={!isEditing}
                className={`block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 transition-all ${
                  isEditing 
                    ? 'focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-[#ffa509]" />
              </div>
              <input
                name="email"
                type="email"
                required
                disabled={!isEditing}
                className={`block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 transition-all ${
                  isEditing 
                    ? 'focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Primary Phone Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primary Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-[#ffa509]" />
              </div>
              <input
                name="phone.primary"
                type="tel"
                required
                disabled={!isEditing}
                className={`block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 transition-all ${
                  isEditing 
                    ? 'focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Primary Phone Number"
                value={formData.phone.primary}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Secondary Phone Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Phone Number (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="phone.secondary"
                type="tel"
                disabled={!isEditing}
                className={`block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 transition-all ${
                  isEditing 
                    ? 'focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Secondary Phone Number (Optional)"
                value={formData.phone.secondary}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#050b2c] to-[#1a237e] text-white rounded-xl hover:from-[#1a237e] hover:to-[#050b2c] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <FaSpinner className="h-5 w-5 animate-spin" />
              ) : (
                <FaSave className="h-5 w-5" />
              )}
              {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
