# Subscription Flow Testing Guide

This guide explains how to test the subscription and payment integration with PhonePe sandbox.

## Prerequisites

1. Node.js and npm installed
2. MongoDB running locally or connection string configured in `.env.local`
3. Required environment variables set in `.env.local`

## Environment Setup

1. Copy `.env.local.example` to `.env.local` if you haven't already:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the following environment variables in `.env.local`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   PHONEPE_MERCHANT_ID=PGTESTPAYUAT
   PHONEPE_API_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
   PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
   ```

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. The application will be available at `http://localhost:3000`

## Testing the Subscription Flow

### Manual Testing

1. **Login** to the application with a test user
2. Navigate to a property details page
3. Click on "Subscribe to View Contact"
4. Select a subscription plan
5. You will be redirected to the PhonePe sandbox
6. Use the following test card details:
   - **Card Number**: 4111 1111 1111 1111
   - **Expiry**: Any future date
   - **CVV**: 123
   - **Name**: Any name
7. Complete the payment
8. You will be redirected back to the application
9. Verify that the contact information is now visible

### Automated Testing

1. Run the test script:
   ```bash
   node scripts/test-payment-flow.js
   ```

2. Follow the instructions in the console to complete the payment in the browser

## Test Card Details

Use the following test card details in the PhonePe sandbox:

| Field          | Test Value         |
|----------------|--------------------|
| Card Number    | 4111 1111 1111 1111|
| Expiry         | Any future date    |
| CVV            | 123                |
| Name           | Any name           |

## Troubleshooting

- **Payment not redirecting back**: Ensure `NEXTAUTH_URL` is set correctly in `.env.local`
- **Invalid merchant ID**: Verify `PHONEPE_MERCHANT_ID` and `PHONEPE_API_KEY` are correct
- **Database connection issues**: Check `MONGODB_URI` in `.env.local`
- **CORS errors**: Ensure all API calls are made to the correct origin

## Production Deployment

For production deployment, update the following environment variables:

```
NODE_ENV=production
PHONEPE_MERCHANT_ID=your_production_merchant_id
PHONEPE_API_KEY=your_production_api_key
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
```
