const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { runStockCheck } = require('../cron/stockAlertJob');

// GET /api/inventory — admin: all inventory items
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { type, lowOnly } = req.query;
    const filter = {};

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (lowOnly === 'true') {
      filter.$expr = { $lt: ['$stock', '$threshold'] };
    }

    const items = await InventoryItem.find(filter).sort({ type: 1, name: 1 });
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    next(err);
  }
});

// GET /api/inventory/low-stock — admin: items below threshold
router.get('/low-stock', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const lowStockItems = await InventoryItem.find({
      $expr: { $lt: ['$stock', '$threshold'] },
    }).sort({ stock: 1 });

    res.json({
      success: true,
      count: lowStockItems.length,
      items: lowStockItems,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/inventory/trigger-alert — admin: manually trigger cron check and email
router.post('/trigger-alert', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const lowItems = await runStockCheck();
    res.json({
      success: true,
      message: `Stock check complete. Found ${lowItems.length} items low.`,
      lowCount: lowItems.length,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/inventory/:id — admin: update stock + threshold
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { stock, threshold, unit, name } = req.body;
    const updateData = {};

    if (stock !== undefined) updateData.stock = Number(stock);
    if (threshold !== undefined) updateData.threshold = Number(threshold);
    if (unit) updateData.unit = unit;
    if (name) updateData.name = name;

    const item = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      item,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
