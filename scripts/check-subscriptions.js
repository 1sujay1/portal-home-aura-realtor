require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const { sendEmail } = require('../lib/email');

async function checkExpiredSubscriptions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find users with active subscriptions that have expired
    const now = new Date();
    const users = await User.find({
      'subscription.status': 'active',
      'subscription.endDate': { $lte: now }
    });

    console.log(`Found ${users.length} subscriptions to process`);

    // Process each user with an expired subscription
    for (const user of users) {
      try {
        // Update subscription status to expired
        user.subscription.status = 'expired';
        user.subscription.autoRenew = false;
        
        // Add to subscription history
        if (!user.subscriptionHistory) {
          user.subscriptionHistory = [];
        }
        
        user.subscriptionHistory.push({
          subscription: user.subscription,
          status: 'expired',
          changedAt: new Date()
        });

        await user.save();
        console.log(`Expired subscription for user: ${user.email}`);

        // Send expiration email
        await sendExpirationEmail(user);
      } catch (error) {
        console.error(`Error processing user ${user._id}:`, error);
      }
    }

    // Check for upcoming renewals (7 days before expiration)
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 7);
    
    const upcomingRenewals = await User.find({
      'subscription.status': 'active',
      'subscription.autoRenew': true,
      'subscription.endDate': { 
        $lte: renewalDate,
        $gt: now
      },
      'subscription.nextRenewalNotice': { $ne: renewalDate.toISOString().split('T')[0] }
    });

    console.log(`Found ${upcomingRenewals.length} upcoming renewals to notify`);

    // Send renewal notices
    for (const user of upcomingRenewals) {
      try {
        await sendRenewalNotice(user);
        
        // Update to prevent duplicate notices
        user.subscription.nextRenewalNotice = renewalDate.toISOString().split('T')[0];
        await user.save();
        
        console.log(`Sent renewal notice to: ${user.email}`);
      } catch (error) {
        console.error(`Error sending renewal notice to ${user.email}:`, error);
      }
    }

    console.log('Subscription check completed');
    process.exit(0);
  } catch (error) {
    console.error('Error in subscription check:', error);
    process.exit(1);
  }
}

async function sendExpirationEmail(user) {
  const emailContent = `
    <h2>Your Subscription Has Expired</h2>
    <p>Hello ${user.name},</p>
    <p>Your subscription to our service has expired on ${new Date(user.subscription.endDate).toLocaleDateString()}.</p>
    <p>To continue enjoying our services, please renew your subscription.</p>
    <p><a href="${process.env.NEXTAUTH_URL}/subscription" style="display: inline-block; padding: 10px 20px; background-color: #ffa509; color: white; text-decoration: none; border-radius: 5px;">Renew Now</a></p>
    <p>If you have any questions, please contact our support team.</p>
    <p>Best regards,<br>HomeAura Team</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Your Subscription Has Expired',
    html: emailContent,
  });
}

async function sendRenewalNotice(user) {
  const daysRemaining = Math.ceil((user.subscription.endDate - new Date()) / (1000 * 60 * 60 * 24));
  
  const emailContent = `
    <h2>Subscription Renewal Notice</h2>
    <p>Hello ${user.name},</p>
    <p>Your subscription will renew in ${daysRemaining} days (on ${user.subscription.endDate.toLocaleDateString()}).</p>
    <p>You will be automatically charged according to your current plan.</p>
    <p>To update your payment method or subscription details, please visit your account settings.</p>
    <p><a href="${process.env.NEXTAUTH_URL}/dashboard/profile" style="display: inline-block; padding: 10px 20px; background-color: #ffa509; color: white; text-decoration: none; border-radius: 5px;">Manage Subscription</a></p>
    <p>If you have any questions, please contact our support team.</p>
    <p>Best regards,<br>HomeAura Team</p>
  `;

  await sendEmail({
    to: user.email,
    subject: `Subscription Renewal in ${daysRemaining} Days`,
    html: emailContent,
  });
}

// Run the check
checkExpiredSubscriptions();
