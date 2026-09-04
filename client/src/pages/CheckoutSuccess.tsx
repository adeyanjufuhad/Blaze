import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Clock, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'BLZ-' + Math.floor(Math.random() * 89999 + 10000);

  useEffect(() => {
    // Fire confetti celebration on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4500', '#ffaa00', '#ffffff'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#fffaf5] px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="max-w-md w-full rounded-3xl border border-[#f0e6d9] bg-white p-8 sm:p-10 text-center shadow-blaze-card space-y-6"
      >
        {/* Animated checkmark icon with bounce */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ duration: 0.6, times: [0, 0.7, 1] }}
            className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-500/10"
          >
            <Check className="w-10 h-10 stroke-[3.5]" />
          </motion.div>
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#ff4500]">
            Payment Received & Verified
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#1a0a00] mt-1">
            Order Placed!
          </h1>
          <p className="text-sm text-[#8a6a50] mt-2">
            Your pizza is being queued in the oven. Get ready for blazing hot crusts delivered straight to your door.
          </p>
        </div>

        {/* Order ID Tag */}
        <div className="rounded-xl border border-[#f0e6d9] bg-[#fffaf5] p-4 space-y-1 text-xs">
          <span className="text-[#8a6a50] font-bold uppercase">Order Reference</span>
          <div className="text-[#1a0a00] font-mono font-bold text-sm tracking-wider">
            {orderId}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 pt-2">
          <Link
            to="/orders"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-lg shadow-[#ff4500]/30 active:scale-95"
          >
            <Clock className="w-4 h-4" />
            <span>Track Your Order</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/menu"
            className="w-full inline-block py-3 rounded-xl border border-[#f0e6d9] hover:border-[#ff4500] text-[#8a6a50] hover:text-[#1a0a00] bg-white font-bold uppercase text-[11px] tracking-wider transition-colors"
          >
            Return to Menu
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
