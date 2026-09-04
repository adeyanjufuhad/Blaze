const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const InventoryItem = require('../models/InventoryItem');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/razorpayService');
const { emitOrderStatusUpdate, emitNewOrderToAdmin } = require('../socket');

// Helper to decrement stock for pizza ingredients
const decrementInventoryForOrder = async (items) => {
  for (const item of items) {
    const qty = item.quantity || 1;
    const { customization } = item;

    if (customization) {
      if (customization.base) {
        await InventoryItem.updateOne(
          { name: { $regex: new RegExp(`^${customization.base}$`, 'i') }, stock: { $gte: qty } },
          { $inc: { stock: -qty } }
        );
      }
      if (customization.sauce) {
        await InventoryItem.updateOne(
          { name: { $regex: new RegExp(`^${customization.sauce}$`, 'i') }, stock: { $gte: qty } },
          { $inc: { stock: -qty } }
        );
      }
      if (customization.cheese) {
        await InventoryItem.updateOne(
          { name: { $regex: new RegExp(`^${customization.cheese}$`, 'i') }, stock: { $gte: qty } },
          { $inc: { stock: -qty } }
        );
      }
      if (Array.isArray(customization.vegetables)) {
        for (const veg of customization.vegetables) {
          await InventoryItem.updateOne(
            { name: { $regex: new RegExp(`^${veg}$`, 'i') }, stock: { $gte: qty } },
            { $inc: { stock: -qty } }
          );
        }
      }
    }
  }
};

// POST /api/order/create — create Razorpay order with amount in paise
router.post('/create', authenticateToken, async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required' });
    }

    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity || 1)), 0);
    const deliveryFee = 500; // Flat ₦500
    const totalAmount = subtotal + deliveryFee;

    // Generate Razorpay Order
    const razorpayOrder = await createRazorpayOrder(totalAmount, req.user._id);

    res.json({
      success: true,
      orderId: razorpayOrder.orderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: razorpayOrder.key,
      isMock: razorpayOrder.isMock,
      calculatedTotal: totalAmount,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/order/verify — verify Razorpay payment, save order, decrement inventory, emit socket event
router.post('/verify', authenticateToken, async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      deliveryAddress,
      totalAmount,
    } = req.body;

    if (!razorpayOrderId || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Invalid order verification payload' });
    }

    // Verify signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
    }

    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity || 1)), 0);
    const deliveryFee = 500;
    const finalTotal = totalAmount || (subtotal + deliveryFee);

    // Save order in database
    const order = new Order({
      user: req.user._id,
      items,
      subtotal,
      deliveryFee,
      totalAmount: finalTotal,
      razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
      status: 'order_received',
      paymentStatus: 'paid',
      deliveryAddress: {
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        phone: deliveryAddress.phone || '',
      },
    });

    await order.save();

    // Decrement inventory stock
    await decrementInventoryForOrder(items);

    // Populate user details for real-time events
    await order.populate('user', 'name email');

    // Emit live events
    emitOrderStatusUpdate(req.user._id, {
      orderId: order._id,
      status: order.status,
      updatedAt: order.updatedAt,
    });
    emitNewOrderToAdmin(order);

    res.status(201).json({
      success: true,
      message: 'Order placed and payment verified successfully',
      order,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/order/my-orders — user: their orders
router.get('/my-orders', authenticateToken, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.pizza', 'name image category badge')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/order — admin: all orders
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    let orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.pizza', 'name image')
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o._id.toString().includes(q) ||
          (o.user && (o.user.name.toLowerCase().includes(q) || o.user.email.toLowerCase().includes(q)))
      );
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
});

// PUT /api/order/:id/status — admin: update order status, emit socket event to user
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['order_received', 'in_kitchen', 'sent_to_delivery', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status transition' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Emit live WebSocket update to the customer
    emitOrderStatusUpdate(order.user._id, {
      orderId: order._id,
      status: order.status,
      updatedAt: order.updatedAt,
    });

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
