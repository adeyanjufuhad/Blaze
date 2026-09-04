import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Utensils, Bike, CheckCircle2 } from 'lucide-react';
import { OrderStatus } from '../../types';

interface OrderStatusPipelineProps {
  status: OrderStatus;
  className?: string;
}

const pipelineSteps: {
  key: OrderStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: 'order_received', label: 'Order Received', icon: Clock },
  { key: 'in_kitchen', label: 'In Kitchen', icon: Utensils },
  { key: 'sent_to_delivery', label: 'Sent to Delivery', icon: Bike },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export const OrderStatusPipeline: React.FC<OrderStatusPipelineProps> = ({
  status,
  className = '',
}) => {
  const getStepIndex = (s: OrderStatus) => {
    switch (s) {
      case 'order_received':
        return 0;
      case 'in_kitchen':
        return 1;
      case 'sent_to_delivery':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className={`w-full py-4 select-none ${className}`}>
      <div className="relative flex items-center justify-between">
        {/* Continuous background bar */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-[#f0e6d9] z-0" />

        {/* Dynamic active progress bar */}
        <motion.div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-gradient-to-r from-[#ff4500] to-[#ff6b35] z-0"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentIndex / (pipelineSteps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Step dots */}
        {pipelineSteps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center group"
            >
              {/* Dot / Icon Circle */}
              <motion.div
                initial={false}
                animate={
                  isActive
                    ? { scale: [1, 1.12, 1], boxShadow: '0 0 18px rgba(255, 69, 0, 0.5)' }
                    : { scale: 1, boxShadow: 'none' }
                }
                transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-[#ff4500] bg-[#ff4500] text-white shadow-md'
                    : isDone
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : 'border-[#f0e6d9] bg-white text-[#8a6a50]'
                }`}
              >
                {isDone ? (
                  <Check className="h-5 w-5 stroke-[3]" />
                ) : (
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </motion.div>

              {/* Label */}
              <div className="absolute top-12 md:top-14 text-center whitespace-nowrap">
                <span
                  className={`text-[10px] md:text-xs font-black uppercase tracking-tight ${
                    isActive
                      ? 'text-[#ff4500]'
                      : isDone
                      ? 'text-[#1a0a00]'
                      : 'text-[#8a6a50]'
                  }`}
                >
                  {step.label}
                </span>
                {isActive && (
                  <span className="block text-[9px] font-bold text-[#ff6b35] animate-pulse">
                    Live Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Spacer for bottom labels */}
      <div className="h-6 md:h-7" />
    </div>
  );
};

export default OrderStatusPipeline;
