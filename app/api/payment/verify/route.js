import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/user';
import { verifyToken } from '@/lib/jwt';

// Helper function to get plan details
function getPlanDetails(planId) {
  const plans = {
    basic: { name: 'Basic', duration: 30, price: 499 },
    premium: { name: 'Premium', duration: 90, price: 1299 },
    enterprise: { name: 'Enterprise', duration: 365, price: 3999 },
  };
  return plans[planId] || { name: 'Custom', duration: 30, price: 0 };
}

// PhonePe test credentials
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function POST(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { transactionId } = await request.json();
    
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user details
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the payment intent
    // For test environment, we'll simulate a successful verification
    // In production, we would verify with PhonePe's API
    const isTestEnvironment = process.env.NODE_ENV !== 'production';
    let paymentStatus = isTestEnvironment ? 'PAYMENT_SUCCESS' : 'FAILED';
    
    if (!isTestEnvironment) {
      // In production, verify with PhonePe's API
      try {
        const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': crypto
              .createHash('sha256')
              .update(`/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}${PHONEPE_API_KEY}`)
              .digest('hex') + '###1',
          },
        });
        
        const data = await response.json();
        paymentStatus = data.code || 'FAILED';
      } catch (error) {
        console.error('Error verifying payment with PhonePe:', error);
        paymentStatus = 'FAILED';
      }
    }

    // Update payment intent status
    const paymentIntentIndex = user.paymentIntents.findIndex(
      (pi) => pi.transactionId === transactionId
    );
    
    if (paymentIntentIndex === -1) {
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 404 }
      );
    }

    const paymentIntent = user.paymentIntents[paymentIntentIndex];
    const isSuccess = paymentStatus === 'PAYMENT_SUCCESS';
    
    paymentIntent.status = isSuccess ? 'succeeded' : 'failed';
    paymentIntent.updatedAt = new Date();
    
    // If payment was successful, update user's subscription
    if (isSuccess) {
      const planId = paymentIntent.planId;
      const plan = getPlanDetails(planId);
      const now = new Date();
      
      user.subscription = {
        planId,
        status: 'active',
        startDate: now,
        endDate: new Date(now.getTime() + (plan.duration || 30) * 24 * 60 * 60 * 1000), // Default to 30 days if duration not set
        transactionId,
        updatedAt: now,
      };
      
      // Update the payment intent with subscription details
      paymentIntent.metadata = {
        ...(paymentIntent.metadata || {}),
        subscriptionId: `sub_${Date.now()}`,
        planName: plan.name || 'Premium Plan',
        amount: plan.price || 0,
      };
    } else {
      // If payment failed, update the error details
      paymentIntent.error = 'Payment verification failed';
    }
    
    // Mark as modified to ensure Mongoose saves the changes
    user.markModified('paymentIntents');
    await user.save();
    
    return NextResponse.json({
      success: isSuccess,
      status: isSuccess ? 'Payment successful' : 'Payment failed',
      transactionId,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error('Error in payment verification:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
