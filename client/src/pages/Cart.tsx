import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, MapPin, CreditCard, Lock } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { EmptyState } from '../components/ui/EmptyState';
import { toast } from '../components/ui/Toast';
import api from '../lib/api';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, clearCart, getSubtotal, deliveryFee, getTotal } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const subtotal = getSubtotal();
  const total = getTotal();

  // Address state
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    phone: user?.address?.phone || '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showMockModal, setShowMockModal] = useState(false);
  const [pendingRazorpayData, setPendingRazorpayData] = useState<any>(null);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      toast.error('Your cart is empty');
      return;
    }

    if (!isAuthenticated) {
      toast.info('Please log in or create an account to complete your order');
      navigate('/auth/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (!address.street.trim() || !address.city.trim() || !address.state.trim()) {
      toast.error('Please enter a complete delivery address (street, city, state)');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on server
      const createRes = await api.post('/api/order/create', {
        items,
        deliveryAddress: address,
      });

      const { orderId, amount, currency, key, isMock } = createRes.data;

      // 2. Razorpay Checkout or Seamless Mock Test Modal
      if (!isMock && window.Razorpay) {
        const options = {
          key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency || 'INR',
          name: 'Blaze Pizza',
          description: 'Wood-fired artisanal pizzas',
          order_id: orderId,
          image: '/favicon.svg',
          handler: async (response: any) => {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id || orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: address.phone || '',
          },
          theme: {
            color: '#ff4500',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          toast.error(resp.error?.description || 'Payment was declined');
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Mock / Sandbox modal fallback for zero-config test environments
        setPendingRazorpayData({ orderId, amount, currency });
        setShowMockModal(true);
      }
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      toast.error(err.response?.data?.message || 'Could not initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (verificationPayload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    try {
      const verifyRes = await api.post('/api/order/verify', {
        ...verificationPayload,
        items,
        deliveryAddress: address,
        totalAmount: total,
      });

      if (verifyRes.data?.success) {
        const savedOrder = verifyRes.data.order;
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/checkout/success?orderId=${savedOrder._id}`);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      toast.error(err.response?.data?.message || 'Payment verification failed');
    } finally {
      setIsProcessing(false);
      setShowMockModal(false);
    }
  };

  const handleSimulateTestPayment = async () => {
    if (!pendingRazorpayData) return;
    await verifyPayment({
      razorpayOrderId: pendingRazorpayData.orderId,
      razorpayPaymentId: `pay_test_${Date.now()}`,
      razorpaySignature: 'mock_signature',
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffaf5] py-20 px-4 max-w-4xl mx-auto">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="You haven't added any blazing hot pizzas or custom creations yet. Head to our menu or design your own pie!"
          actionText="Browse Menu"
          actionLink="/menu"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-[#ff4500]">
          Checkout & Delivery
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#1a0a00] mt-1">
          Review Your Order
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Cart Items + Delivery Address Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Cart Items List */}
          <div className="rounded-2xl border border-[#f0e6d9] bg-white p-6 space-y-4 shadow-blaze-card">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0e6d9]">
              <h3 className="font-black text-lg uppercase tracking-tight text-[#1a0a00]">
                Bag Items ({items.length})
              </h3>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-bold text-[#8a6a50] hover:text-[#ff4500] transition-colors uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>

            <div className="divide-y divide-[#f0e6d9]">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#fffaf5] border border-[#f0e6d9]">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80'
                      }
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-black text-sm uppercase tracking-tight text-[#1a0a00]">
                      {item.name}
                    </h4>

                    {item.isCustom && item.customization && (
                      <p className="text-xs text-[#8a6a50] mt-0.5">
                        {item.customization.base} · {item.customization.sauce} ·{' '}
                        {item.customization.cheese}
                        {item.customization.vegetables?.length > 0 &&
                          ` · ${item.customization.vegetables.join(', ')}`}
                      </p>
                    )}

                    <div className="text-sm font-black text-[#ff4500] mt-1">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity Stepper + Remove */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-xl bg-[#fffaf5] border border-[#f0e6d9] px-2 py-1">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="text-[#8a6a50] hover:text-[#1a0a00] p-1"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-[#1a0a00]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="text-[#8a6a50] hover:text-[#1a0a00] p-1"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[#8a6a50] hover:text-[#ff4500] transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Form */}
          <div className="rounded-2xl border border-[#f0e6d9] bg-white p-6 shadow-blaze-card space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-[#f0e6d9]">
              <MapPin className="w-5 h-5 text-[#ff4500]" />
              <h3 className="font-black text-lg uppercase tracking-tight text-[#1a0a00]">
                Delivery Address
              </h3>
            </div>

            <form onSubmit={handleProceedToPayment} id="checkout-form" className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6a50] mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="e.g. 24 Blaze Boulevard, Apt 4"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full bg-[#fffaf5] border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl px-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50]/60 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6a50] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Lagos"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full bg-[#fffaf5] border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl px-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50]/60 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6a50] mb-1.5">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="e.g. Lagos State"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full bg-[#fffaf5] border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl px-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50]/60 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6a50] mb-1.5">
                  Phone Number (For Rider Contact)
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +234 801 234 5678"
                  value={address.phone}
                  onChange={handleAddressChange}
                  className="w-full bg-[#fffaf5] border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl px-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50]/60 focus:outline-none transition-colors"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Order Summary & Payment Button */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-2xl border border-[#f0e6d9] bg-white p-6 space-y-6 shadow-blaze-card">
            <h3 className="font-black text-lg uppercase tracking-tight text-[#1a0a00] border-b border-[#f0e6d9] pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm text-[#8a6a50]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#1a0a00]">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Flat Delivery Fee</span>
                <span className="font-bold text-[#1a0a00]">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-[#1a0a00] pt-4 border-t border-[#f0e6d9]">
                <span>Total Due</span>
                <span className="text-[#ff4500] text-2xl">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Security notice */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#fff5f0] border border-[#f0e6d9] text-xs text-[#8a6a50]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Razorpay 256-bit encrypted test checkout enabled.</span>
            </div>

            {/* Action button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-xl shadow-[#ff4500]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <span>Securing Payment...</span>
              ) : (
                <>
                  <span>Proceed to Payment · ₦{total.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mock / Test Payment Modal */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#f0e6d9] bg-white p-6 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[#f0e6d9] pb-4">
              <div className="p-2.5 rounded-xl bg-[#ff4500]/15 text-[#ff4500]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-[#1a0a00]">
                  Razorpay Sandbox Checkout
                </h3>
                <span className="text-xs text-[#8a6a50]">
                  Instant Test Payment Simulation
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#8a6a50] bg-[#fffaf5] p-4 rounded-xl border border-[#f0e6d9]">
              <div className="flex justify-between">
                <span>Test Order ID:</span>
                <span className="text-[#1a0a00] font-mono">{pendingRazorpayData?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="text-[#ff4500] font-black text-sm">₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Test Card:</span>
                <span className="text-[#1a0a00] font-mono">4111 1111 1111 1111</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowMockModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#f0e6d9] text-xs font-black uppercase text-[#8a6a50] hover:text-[#1a0a00] bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulateTestPayment}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-xs font-black uppercase text-white shadow-lg shadow-[#ff4500]/30 transition-all"
              >
                {isProcessing ? 'Verifying...' : 'Pay ₦' + total.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
