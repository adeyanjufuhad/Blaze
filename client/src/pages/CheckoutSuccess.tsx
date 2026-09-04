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
        colors: ['#2d5a27', '#111111', '#e8e4dd'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#faf9f6] px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="max-w-md w-full rounded-3xl border border-[#e8e4dd] bg-white p-8 sm:p-10 text-center space-y-6 shadow-sm"
      >
        {/* Animated checkmark icon with bounce */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-full bg-[#2d5a27] flex items-center justify-center text-white"
          >
            <Check className="w-8 h-8 stroke-[2.5]" />
          </motion.div>
        </div>

        <div>
          <span className="text-xs font-medium tracking-widest text-[#666666] uppercase">
            Payment Verified
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-[#111111] mt-1">
            Order Confirmed
          </h1>
          <p className="text-xs text-[#666666] mt-2 leading-relaxed">
            Your pizza is being prepared and queued for the wood-fired oven. Follow your order status in real time.
          </p>
        </div>

        {/* Order ID Tag */}
        <div className="rounded-xl border border-[#e8e4dd] bg-[#faf9f6] p-3 space-y-0.5 text-xs">
          <span className="text-[#888888] text-[10px] uppercase tracking-wider block">Order Reference</span>
          <div className="text-[#111111] font-mono font-medium text-sm">
            {orderId}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2.5 pt-2">
          <Link
            to="/orders"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white text-xs font-medium tracking-wide transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Track Your Order</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/menu"
            className="w-full inline-block py-2.5 rounded-full border border-[#e8e4dd] hover:border-[#111111] text-[#666666] hover:text-[#111111] bg-white text-xs font-medium tracking-wide transition-colors"
          >
            Return to Menu
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
