import { NextResponse } from 'next/server';
import User from '@/models/user';
import connectDB from '@/lib/db';

// List of protected routes that require an active subscription
const PROTECTED_ROUTES = [
  '/api/properties',
  '/api/enquiries',
  '/api/listings',
  // Add more protected routes as needed
];

// List of public routes that don't require a subscription
const PUBLIC_ROUTES = [
  '/api/auth',
  '/api/payment/webhook',
  // Add more public routes as needed
];

export async function subscriptionMiddleware(request) {
  const { pathname } = new URL(request.url);
  
  // Skip middleware for non-API routes or public routes
  if (!pathname.startsWith('/api/') || 
      PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if the route requires subscription
  const requiresSubscription = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (!requiresSubscription) {
    return NextResponse.next();
  }

  try {
    // Get user from the request (set by auth middleware)
    const userData = request.headers.get('user');
    if (!userData) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userData);
    
    // Connect to database
    await connectDB();
    
    // Get fresh user data with subscription info
    const dbUser = await User.findById(user.id).select('subscription');
    
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check subscription status
    if (!dbUser.subscription || !isSubscriptionActive(dbUser.subscription)) {
      return NextResponse.json(
        { 
          error: 'Active subscription required',
          code: 'SUBSCRIPTION_REQUIRED',
          redirect: '/subscription'
        },
        { status: 403 }
      );
    }

    // Continue to the protected route
    return NextResponse.next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to check if subscription is active
function isSubscriptionActive(subscription) {
  if (!subscription || subscription.status !== 'active') {
    return false;
  }

  const now = new Date();
  const endDate = new Date(subscription.endDate);
  
  return endDate > now;
}

// Middleware to combine with auth middleware
export function withSubscription(handler) {
  return async function withSubscriptionHandler(req, ...args) {
    // First run auth check
    const authResponse = await authMiddleware(req);
    if (authResponse && authResponse.status !== 200) {
      return authResponse;
    }
    
    // Then run subscription check
    const subResponse = await subscriptionMiddleware(req);
    if (subResponse && subResponse.status !== 200) {
      return subResponse;
    }
    
    // If both checks pass, call the original handler
    return handler(req, ...args);
  };
}
