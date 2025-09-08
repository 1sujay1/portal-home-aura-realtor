const axios = require('axios');
const crypto = require('crypto');

// Test configuration
const config = {
  baseUrl: 'http://localhost:3000/api',
  testUser: {
    email: 'test@example.com',
    password: 'password123',
    phone: '9876543210'
  },
  plan: {
    id: 'premium',
    amount: 1299, // in INR
    duration: 90 // in days
  },
  propertyId: 'test-property-123'
};

// Helper function to make authenticated requests
async function makeRequest(method, url, data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios({
      method,
      url: `${config.baseUrl}${url}`,
      data,
      headers,
      validateStatus: () => true // Don't throw on HTTP error status
    });
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

// Test the payment flow
async function testPaymentFlow() {
  console.log('Starting payment flow test...');
  
  // 1. Login (or register if needed)
  console.log('\n1. Logging in test user...');
  const loginResponse = await makeRequest('post', '/auth/login', {
    email: config.testUser.email,
    password: config.testUser.password
  });

  if (!loginResponse.token) {
    console.error('Login failed:', loginResponse.error || 'Unknown error');
    return;
  }
  
  const token = loginResponse.token;
  console.log('✅ Login successful');

  // 2. Initiate payment
  console.log('\n2. Initiating payment...');
  const paymentResponse = await makeRequest(
    'post', 
    '/payment/initiate', 
    {
      planId: config.plan.id,
      amount: config.plan.amount,
      returnUrl: `${config.baseUrl}/subscription/success`,
      propertyId: config.propertyId
    },
    token
  );

  if (!paymentResponse.url) {
    console.error('Payment initiation failed:', paymentResponse.error || 'Unknown error');
    return;
  }

  console.log('✅ Payment initiated successfully');
  console.log('Payment URL:', paymentResponse.url);
  console.log('\n3. Please open the URL above in your browser to complete the payment in the PhonePe sandbox');
  console.log('   Use the following test card details:');
  console.log('   - Card Number: 4111 1111 1111 1111');
  console.log('   - Expiry: Any future date');
  console.log('   - CVV: 123');
  console.log('   - Name: Any name');
  
  // 3. In a real test, you would automate the payment completion
  // For now, we'll simulate a successful payment verification
  console.log('\n4. Simulating payment verification...');
  
  // Get the transaction ID from the payment URL
  const transactionId = paymentResponse.transactionId;
  
  // Verify the payment
  const verifyResponse = await makeRequest(
    'post',
    '/payment/verify',
    { transactionId },
    token
  );

  if (verifyResponse.success) {
    console.log('✅ Payment verified successfully!');
    console.log('Subscription details:', verifyResponse.subscription);
  } else {
    console.error('Payment verification failed:', verifyResponse.error || 'Unknown error');
  }
}

// Run the test
testPaymentFlow().catch(console.error);
