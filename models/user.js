import mongoose from 'mongoose';

const paymentIntentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  planId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  metadata: { type: Object },
  paymentDetails: { type: Object },
  error: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  paidAt: { type: Date }
});

const subscriptionSchema = new mongoose.Schema({
  planId: { 
    type: String, 
    required: true,
    enum: ['basic', 'premium', 'enterprise']
  },
  planName: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending',
    required: true 
  },
  startDate: { 
    type: Date, 
    default: null 
  },
  endDate: { 
    type: Date, 
    default: null 
  },
  transactionId: { 
    type: String,
    index: true
  },
  paymentDetails: { 
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  autoRenew: { 
    type: Boolean, 
    default: true 
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  lastBillingDate: {
    type: Date,
    default: null
  },
  nextBillingDate: {
    type: Date,
    default: null
  },
  trialPeriod: {
    type: Boolean,
    default: false
  },
  trialStart: {
    type: Date,
    default: null
  },
  trialEnd: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Add methods to subscription schema
subscriptionSchema.methods = {
  isActive() {
    if (this.status !== 'active') return false;
    const now = new Date();
    return (!this.endDate || new Date(this.endDate) > now);
  },
  
  daysRemaining() {
    if (!this.endDate || !this.isActive()) return 0;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const end = new Date(this.endDate);
    const now = new Date();
    return Math.ceil((end - now) / oneDay);
  },
  
  async cancel(cancellationReason = 'User requested cancellation') {
    this.status = 'cancelled';
    this.cancellationReason = cancellationReason;
    this.autoRenew = false;
    await this.save();
    return this;
  },
  
  async renew(planId, durationInDays) {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + durationInDays);
    
    this.planId = planId;
    this.status = 'active';
    this.startDate = now;
    this.endDate = endDate;
    this.lastBillingDate = now;
    this.nextBillingDate = endDate;
    
    await this.save();
    return this;
  }
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  subscription: {
    type: subscriptionSchema,
    default: null
  },
  paymentIntents: [paymentIntentSchema],
  subscriptionHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionHistory'
  }],
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    primary: {
      type: String,
      required: [true, 'Please provide your primary phone number'],
      trim: true
    },
    secondary: {
      type: String,
      trim: true
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: subscriptionSchema,
  paymentIntents: [paymentIntentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { 
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      return ret;
    }
  }
});

// Add methods to user schema
userSchema.methods = {
  hasActiveSubscription() {
    return this.subscription && this.subscription.isActive();
  },
  
  async createSubscription(planId, transactionId, paymentDetails = {}) {
    const plan = getPlanDetails(planId);
    if (!plan) {
      throw new Error('Invalid plan ID');
    }
    
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + plan.duration);
    
    this.subscription = {
      planId: plan.id,
      planName: plan.name,
      status: 'active',
      startDate: now,
      endDate,
      transactionId,
      paymentDetails,
      lastBillingDate: now,
      nextBillingDate: endDate
    };
    
    await this.save();
    return this.subscription;
  },
  
  async cancelSubscription(reason = 'User requested cancellation') {
    if (!this.subscription) {
      throw new Error('No active subscription to cancel');
    }
    
    await this.subscription.cancel(reason);
    return this.save();
  },
  
  async updateSubscription(planId) {
    const plan = getPlanDetails(planId);
    if (!plan) {
      throw new Error('Invalid plan ID');
    }
    
    if (!this.subscription) {
      return this.createSubscription(planId);
    }
    
    // If upgrading, extend from current end date
    // If downgrading, start from next billing cycle
    const now = new Date();
    const endDate = new Date(this.subscription.endDate > now ? this.subscription.endDate : now);
    endDate.setDate(endDate.getDate() + plan.duration);
    
    this.subscription.planId = plan.id;
    this.subscription.planName = plan.name;
    this.subscription.status = 'active';
    this.subscription.endDate = endDate;
    this.subscription.nextBillingDate = endDate;
    
    await this.save();
    return this.subscription;
  },
  
  async processSubscriptionRenewal() {
    if (!this.subscription || !this.subscription.autoRenew) {
      return false;
    }
    
    const plan = getPlanDetails(this.subscription.planId);
    if (!plan) {
      this.subscription.status = 'expired';
      await this.save();
      return false;
    }
    
    // In a real app, this would process payment
    // For now, we'll just extend the subscription
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + plan.duration);
    
    this.subscription.status = 'active';
    this.subscription.lastBillingDate = now;
    this.subscription.nextBillingDate = endDate;
    this.subscription.endDate = endDate;
    
    await this.save();
    return true;
  }
};

// Helper function to get plan details
function getPlanDetails(planId) {
  const plans = {
    basic: { id: 'basic', name: 'Basic', duration: 30, price: 499 },
    premium: { id: 'premium', name: 'Premium', duration: 90, price: 1299 },
    enterprise: { id: 'enterprise', name: 'Enterprise', duration: 365, price: 3999 }
  };
  return plans[planId];
}

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = new Date();
  next();
});

// Ensure the model is registered only once
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
