const cron = require('node-cron');
const InventoryItem = require('../models/InventoryItem');
const { sendLowStockAlertEmail } = require('../services/emailService');

const runStockCheck = async () => {
  try {
    const lowStockItems = await InventoryItem.find({
      $expr: { $lt: ['$stock', '$threshold'] },
    });

    console.log(`[Blaze Cron] Stock check complete — ${lowStockItems.length} items low`);

    if (lowStockItems.length > 0) {
      await sendLowStockAlertEmail(process.env.ADMIN_EMAIL || 'admin@blaze.com', lowStockItems);
    }

    return lowStockItems;
  } catch (err) {
    console.error('[Blaze Cron] Stock check failed:', err);
    return [];
  }
};

const initCronJobs = () => {
  // Run every day at 8:00 AM: '0 8 * * *'
  cron.schedule('0 8 * * *', async () => {
    console.log('[Blaze Cron] Running scheduled 8:00 AM stock check...');
    await runStockCheck();
  });

  console.log('[Blaze Cron] Stock alert cron job scheduled (0 8 * * *)');
};

module.exports = {
  initCronJobs,
  runStockCheck,
};
