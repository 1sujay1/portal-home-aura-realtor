// Utility functions for contact information masking and subscription management

/**
 * Masks email address to show partial information
 * Example: john.doe@example.com -> j***@e***.com
 */
export function maskEmail(email) {
  if (!email) return '';
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username.length > 1 
    ? username[0] + '*'.repeat(Math.min(username.length - 1, 3))
    : username;
  
  const [domainName, extension] = domain.split('.');
  const maskedDomain = domainName.length > 1 
    ? domainName[0] + '*'.repeat(Math.min(domainName.length - 1, 3))
    : domainName;
  
  return `${maskedUsername}@${maskedDomain}.${extension}`;
}

/**
 * Masks phone number to show partial information
 * Example: +1234567890 -> +123****890
 */
export function maskPhone(phone) {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
  if (cleanPhone.length < 6) return phone;
  
  const start = cleanPhone.slice(0, 3);
  const end = cleanPhone.slice(-3);
  const middle = '*'.repeat(Math.min(cleanPhone.length - 6, 4));
  
  return `${start}${middle}${end}`;
}

/**
 * Check if user has active subscription for contact access
 */
export function hasContactAccess(user) {
  // For now, return false to show subscription flow
  // In production, check user's subscription status
  return user?.subscription?.plan && user.subscription.status === 'active';
}

/**
 * Get subscription plans configuration
 */
export function getSubscriptionPlans() {
  return [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      duration: 'month',
      features: [
        'View 10 property contacts per month',
        'Basic property search',
        'Email support',
        'Mobile app access'
      ],
      popular: false,
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 19.99,
      duration: 'month',
      features: [
        'Unlimited property contacts',
        'Advanced property search & filters',
        'Priority email support',
        'Mobile app access',
        'Property alerts & notifications',
        'Save favorite properties'
      ],
      popular: true,
      color: 'from-[#ffa509] to-[#ff9100]'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 49.99,
      duration: 'month',
      features: [
        'Everything in Premium',
        'Bulk contact downloads',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'Priority phone support',
        'Advanced analytics'
      ],
      popular: false,
      color: 'from-[#050b2c] to-[#1a237e]'
    }
  ];
}
