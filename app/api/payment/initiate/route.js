import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/user';
import { verifyToken } from '@/lib/jwt';

// PhonePe test credentials
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const PHONEPE_MERCHANT_USER_ID = process.env.PHONEPE_MERCHANT_USER_ID || 'MUID' + Date.now();
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

    const { planId, amount, returnUrl, propertyId } = await request.json();
    
    if (!planId || !amount) {
      return NextResponse.json(
        { error: 'Plan ID and amount are required' },
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

    // Generate a unique transaction ID
    const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
    
    // Initialize payment intents array if it doesn't exist
    user.paymentIntents = user.paymentIntents || [];
    
    // Prepare the payment request payload
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: PHONEPE_MERCHANT_USER_ID,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${NEXTAUTH_URL}/api/payment/verify`,
      redirectMode: 'POST',
      callbackUrl: `${NEXTAUTH_URL}/api/payment/callback`,
      mobileNumber: user.phone || '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      },
      metadata: {
        planId,
        propertyId,
        userId: user._id.toString(),
      },
    };
    
    // For test environment, use a fixed success URL
    if (process.env.NODE_ENV !== 'production') {
      payload.redirectUrl = `${NEXTAUTH_URL}/subscription/success?transaction_id=${transactionId}&propertyId=${propertyId || ''}`;
    }

    // Convert payload to base64
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // Generate X-VERIFY header
    const string = `${base64Payload}/pg/v1/pay${PHONEPE_API_KEY}`;
    const xVerify = crypto
      .createHash('sha256')
      .update(string)
      .digest('hex') + '###1';

    // Initiate payment with PhonePe
    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const responseData = await response.json();

    if (responseData.code === 'PAYMENT_INITIATED') {
      // Save payment intent to user's record
      user.paymentIntents.push({
        transactionId,
        planId,
        amount,
        status: 'PENDING',
        metadata: { propertyId },
        createdAt: new Date(),
      });
      await user.save();

      return NextResponse.json({
        url: responseData.data.instrumentResponse.redirectInfo.url,
      });
    } else {
      throw new Error(responseData.message || 'Failed to initiate payment');
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
