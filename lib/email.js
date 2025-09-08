const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: process.env.EMAIL_SERVER_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email body
 * @param {string} options.html - HTML email body
 * @returns {Promise} Promise that resolves when the email is sent
 */
async function sendEmail({ to, subject, text, html }) {
  // Don't send emails in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && process.env.ENABLE_EMAILS !== 'true') {
    console.log('Email not sent (development mode):', { to, subject });
    return { messageId: 'simulated-message-id' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'HomeAura'}" <${process.env.EMAIL_FROM_ADDRESS || 'no-reply@homeaurarealtor.com'}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send subscription expiration email
 * @param {Object} user - User object
 * @param {Object} subscription - Subscription details
 * @returns {Promise} Promise that resolves when the email is sent
 */
async function sendSubscriptionExpiredEmail(user, subscription) {
  const emailContent = `
    <h2>Your Subscription Has Expired</h2>
    <p>Hello ${user.name},</p>
    <p>Your ${subscription.planName} subscription has expired on ${new Date(subscription.endDate).toLocaleDateString()}.</p>
    <p>To continue accessing premium features, please renew your subscription.</p>
    <p><a href="${process.env.NEXTAUTH_URL}/subscription" style="display: inline-block; padding: 10px 20px; background-color: #ffa509; color: white; text-decoration: none; border-radius: 5px;">Renew Now</a></p>
    <p>If you have any questions, please contact our support team.</p>
    <p>Best regards,<br>HomeAura Team</p>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Your Subscription Has Expired',
    html: emailContent,
  });
}

/**
 * Send subscription renewal notice email
 * @param {Object} user - User object
 * @param {Object} subscription - Subscription details
 * @param {number} daysUntilRenewal - Number of days until renewal
 * @returns {Promise} Promise that resolves when the email is sent
 */
async function sendRenewalNoticeEmail(user, subscription, daysUntilRenewal) {
  const emailContent = `
    <h2>Subscription Renewal Notice</h2>
    <p>Hello ${user.name},</p>
    <p>Your ${subscription.planName} subscription will renew in ${daysUntilRenewal} days (on ${subscription.endDate.toLocaleDateString()}).</p>
    <p>You will be automatically charged according to your current plan.</p>
    <p>To update your payment method or subscription details, please visit your account settings.</p>
    <p><a href="${process.env.NEXTAUTH_URL}/dashboard/profile" style="display: inline-block; padding: 10px 20px; background-color: #ffa509; color: white; text-decoration: none; border-radius: 5px;">Manage Subscription</a></p>
    <p>If you have any questions, please contact our support team.</p>
    <p>Best regards,<br>HomeAura Team</p>
  `;

  return sendEmail({
    to: user.email,
    subject: `Subscription Renewal in ${daysUntilRenewal} Days`,
    html: emailContent,
  });
}

/**
 * Send subscription confirmation email
 * @param {Object} user - User object
 * @param {Object} subscription - Subscription details
 * @returns {Promise} Promise that resolves when the email is sent
 */
async function sendSubscriptionConfirmationEmail(user, subscription) {
  const emailContent = `
    <h2>Subscription Confirmation</h2>
    <p>Hello ${user.name},</p>
    <p>Thank you for subscribing to our ${subscription.planName} plan!</p>
    <p><strong>Subscription Details:</strong></p>
    <ul>
      <li>Plan: ${subscription.planName}</li>
      <li>Start Date: ${new Date(subscription.startDate).toLocaleDateString()}</li>
      <li>End Date: ${new Date(subscription.endDate).toLocaleDateString()}</li>
      <li>Status: Active</li>
    </ul>
    <p>You now have full access to all premium features. If you have any questions, please don't hesitate to contact our support team.</p>
    <p>Best regards,<br>HomeAura Team</p>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Subscription Confirmation',
    html: emailContent,
  });
}

module.exports = {
  sendEmail,
  sendSubscriptionExpiredEmail,
  sendRenewalNoticeEmail,
  sendSubscriptionConfirmationEmail,
};
