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
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#e8e4dd] z-0" />

        {/* Dynamic active progress bar */}
        <motion.div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#111111] z-0"
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
              <div
                className={`flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                  isActive
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : isDone
                    ? 'border-[#2d5a27] bg-[#2d5a27] text-white'
                    : 'border-[#e8e4dd] bg-white text-[#888888]'
                }`}
              >
                {isDone ? (
                  <Check className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  <Icon className="h-4 w-4 stroke-[1.8]" />
                )}
              </div>

              {/* Label */}
              <div className="absolute top-11 md:top-12 text-center whitespace-nowrap">
                <span
                  className={`text-[10px] md:text-xs font-medium tracking-wide ${
                    isActive
                      ? 'text-[#111111] font-semibold'
                      : isDone
                      ? 'text-[#2d5a27]'
                      : 'text-[#888888]'
                  }`}
                >
                  {step.label}
                </span>
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
