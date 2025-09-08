import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/user';

// PhonePe credentials - Same as in other endpoints
const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY || 'YOUR_API_KEY';

export async function POST(request) {
  try {
    const payload = await request.json();
    
    // Verify the callback is from PhonePe
    const xVerify = request.headers.get('x-verify');
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(payload) + PHONEPE_API_KEY)
      .digest('hex');

    if (xVerify !== hash) {
      console.error('Invalid callback signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const { 
      transactionId, 
      status, 
      code, 
      paymentData 
    } = payload;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with this transaction ID
    const user = await User.findOne({
      'paymentIntents.transactionId': transactionId
    });

    if (!user) {
      console.error('User not found for transaction:', transactionId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the payment intent
    const paymentIntent = user.paymentIntents.find(
      pi => pi.transactionId === transactionId
    );

    if (!paymentIntent) {
      console.error('Payment intent not found for transaction:', transactionId);
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 404 }
      );
    }

    // Update payment intent status
    paymentIntent.status = status;
    paymentIntent.updatedAt = new Date();
    paymentIntent.paymentData = paymentData;

    // If payment is successful, update user's subscription
    if (code === 'PAYMENT_SUCCESS') {
      user.subscription = {
        plan: paymentIntent.planId,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        transactionId: transactionId,
      };
    }

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
