require('dotenv').config();
const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

// Run the subscription check immediately when the worker starts
console.log('Running initial subscription check...');
runSubscriptionCheck();

// Schedule the subscription check to run daily at 3 AM
cron.schedule('0 3 * * *', () => {
  console.log('Running scheduled subscription check...');
  runSubscriptionCheck();
}, {
  timezone: 'Asia/Kolkata' // Adjust to your timezone
});

console.log('Subscription worker started. Checking for expired subscriptions daily at 3 AM.');

function runSubscriptionCheck() {
  const scriptPath = path.join(__dirname, 'check-subscriptions.js');
  
  const child = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error running subscription check:', error);
      return;
    }
    
    if (stderr) {
      console.error('Subscription check stderr:', stderr);
      return;
    }
    
    console.log('Subscription check completed:', stdout);
  });
  
  // Log script output in real-time
  child.stdout.on('data', (data) => {
    console.log(`[Subscription Check] ${data}`);
  });
  
  child.stderr.on('data', (data) => {
    console.error(`[Subscription Check Error] ${data}`);
  });
}

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Shutting down subscription worker...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Subscription worker interrupted');
  process.exit(0);
});
