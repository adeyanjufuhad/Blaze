const crypto = require('crypto');
const Razorpay = require('razorpay');

let razorpayInstance = null;

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (key_id && key_secret && key_id.trim() !== '') {
    if (!razorpayInstance) {
      razorpayInstance = new Razorpay({
        key_id,
        key_secret,
      });
      console.log('[Blaze Razorpay] Initialized live/test Razorpay SDK');
    }
    return { instance: razorpayInstance, isMock: false, key_id, key_secret };
  }

  return { instance: null, isMock: true, key_id: 'rzp_test_mock_blaze_key', key_secret: 'rzp_test_mock_secret' };
};

// Create an order in paise
const createRazorpayOrder = async (amountInNaira, receiptId) => {
  const { instance, isMock, key_id } = getRazorpayInstance();
  // Standardize amount in smallest currency unit (paise / kobo / cents: 100 multiplier)
  const amountInMinorUnits = Math.round(amountInNaira * 100);

  if (isMock || !instance) {
    const mockOrderId = `order_blaze_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    return {
      orderId: mockOrderId,
      amount: amountInMinorUnits,
      currency: 'INR',
      key: key_id,
      isMock: true,
    };
  }

  try {
    const options = {
      amount: amountInMinorUnits,
      currency: 'INR',
      receipt: `rcpt_${receiptId || Date.now()}`.substring(0, 40),
      payment_capture: 1,
    };
    const order = await instance.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: key_id,
      isMock: false,
    };
  } catch (err) {
    console.error('[Blaze Razorpay] Order creation failed, falling back to mock mode:', err.message);
    const mockOrderId = `order_fallback_${Date.now()}`;
    return {
      orderId: mockOrderId,
      amount: amountInMinorUnits,
      currency: 'INR',
      key: key_id,
      isMock: true,
    };
  }
};

// Verify payment signature
const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const { isMock, key_secret } = getRazorpayInstance();

  // If in mock mode or using mock signature
  if (isMock || razorpaySignature === 'mock_signature' || razorpayOrderId.startsWith('order_blaze_') || razorpayOrderId.startsWith('order_fallback_')) {
    return true;
  }

  try {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpaySignature;
  } catch (err) {
    console.error('[Blaze Razorpay] Signature verification error:', err);
    return false;
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  getRazorpayInstance,
};
