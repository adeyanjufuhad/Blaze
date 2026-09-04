const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const InventoryItem = require('../models/InventoryItem');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// POST /api/admin/login — separate admin login endpoint
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: User is not an admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const secret = process.env.JWT_SECRET || 'blaze_jwt_super_secret_access_token_key_2026';
    const adminToken = jwt.sign(
      { id: user._id, email: user.email, role: 'admin', name: user.name },
      secret,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      message: 'Admin authorization granted',
      adminToken,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/dashboard — stats: total orders, revenue today, low stock count, active orders
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Total orders count
    const totalOrdersCount = await Order.countDocuments();

    // Orders today
    const ordersToday = await Order.find({ createdAt: { $gte: startOfToday } });
    const totalOrdersToday = ordersToday.length;

    // Revenue today
    const revenueToday = ordersToday
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Total revenue all-time
    const allPaidOrders = await Order.find({ paymentStatus: 'paid' }, 'totalAmount');
    const totalRevenue = allPaidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Active orders (in kitchen or sent to delivery)
    const activeOrders = await Order.countDocuments({
      status: { $in: ['order_received', 'in_kitchen', 'sent_to_delivery'] },
    });

    // Low stock items count
    const lowStockCount = await InventoryItem.countDocuments({
      $expr: { $lt: ['$stock', '$threshold'] },
    });

    // Recent 10 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Low stock items list (up to 5 for quick cards)
    const lowStockAlerts = await InventoryItem.find({
      $expr: { $lt: ['$stock', '$threshold'] },
    })
      .sort({ stock: 1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalOrdersCount,
        totalOrdersToday,
        revenueToday,
        totalRevenue,
        activeOrders,
        lowStockCount,
      },
      recentOrders,
      lowStockAlerts,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
