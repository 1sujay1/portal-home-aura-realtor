"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getSubscriptionPlans } from '@/lib/contactUtils';
import { FaCheck, FaCrown, FaRocket, FaBuilding, FaSpinner, FaPhone, FaEnvelope } from 'react-icons/fa';
import { BiBuildingHouse } from 'react-icons/bi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function SubscriptionPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const plans = getSubscriptionPlans();

  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const propertyId = searchParams.get('propertyId');
  const [showSuccess, setShowSuccess] = useState(searchParams.get('subscription') === 'success');
  
  // Close success message
  const closeSuccessMessage = () => {
    setShowSuccess(false);
    // Remove the success parameter from URL without reloading the page
    const url = new URL(window.location);
    url.searchParams.delete('subscription');
    window.history.replaceState({}, '', url);
  };

  // Build the success URL with the property ID if available
  const getSuccessUrl = () => {
    if (propertyId) {
      return `/properties/${propertyId}?subscription=success`;
    }
    return returnUrl.includes('?') 
      ? `${returnUrl}&subscription=success` 
      : `${returnUrl}?subscription=success`;
  };

  // Check for payment success/failure when component mounts
  useEffect(() => {
    const status = searchParams.get('payment_status');
    const transactionId = searchParams.get('transaction_id');
    
    if (status === 'success' && transactionId) {
      verifyPayment(transactionId);
    } else if (status === 'failure') {
      toast.error('Payment failed. Please try again.');
    }
  }, []);

  const verifyPayment = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ transactionId })
      });

      if (response.ok) {
        toast.success('Payment verified successfully!');
        // Redirect to success URL with subscription success parameter
        if (typeof window !== 'undefined') {
          window.location.href = getSuccessUrl();
        }
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Payment verification failed. Please contact support.');
    }
  };

  const handlePlanSelect = async (planId) => {
    if (!user) {
      router.push(`/login?redirect=/subscription${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`);
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          planId,
          amount: getSubscriptionPlans().find(p => p.id === planId)?.price || 0,
          returnUrl: `${window.location.origin}/subscription?returnUrl=${encodeURIComponent(returnUrl)}`,
          propertyId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const { url } = await response.json();
      
      // Redirect to PhonePe payment page
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
     finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'basic': return <FaBuilding className="h-8 w-8" />;
      case 'premium': return <FaCrown className="h-8 w-8" />;
      case 'enterprise': return <FaRocket className="h-8 w-8" />;
      default: return <BiBuildingHouse className="h-8 w-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b2c] to-[#1a237e] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your subscription was successful! You now have access to view all contact information.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={closeSuccessMessage}
                    className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-300">
            Unlock property owner contact information and get access to premium features
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-[#ffa509] shadow-2xl shadow-[#ffa509]/20' 
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#ffa509] text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}>
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-white/80">
                  <span className="text-4xl font-bold text-[#ffa509]">${plan.price}</span>
                  <span className="text-lg">/{plan.duration}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheck className="text-[#ffa509] mt-1 flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-[#ffa509] text-white hover:bg-[#ff9100] shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border-2 border-white/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Choose ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 text-white/70">
          <p className="mb-4">All plans include a 7-day free trial. Cancel anytime.</p>
          <p className="text-sm">
            Secure payment processing. Your data is protected with enterprise-grade security.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#050b2c] to-[#1a237e] py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffa509] mx-auto"></div>
          <p className="text-white mt-4">Loading subscription plans...</p>
        </div>
      </div>
    }>
      <SubscriptionPageContent />
    </Suspense>
  );
}
