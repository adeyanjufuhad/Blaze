import React from 'react';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus | 'OK' | 'Low' | 'Critical' | 'paid' | 'failed' | 'Popular' | 'Spicy' | "Chef's Pick" | 'New';
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  showDot = true,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      // Order Statuses
      case 'order_received':
        return {
          label: 'Order Received',
          bg: 'bg-blue-950/60 text-blue-400 border-blue-800/60',
          dot: 'bg-blue-400',
        };
      case 'in_kitchen':
        return {
          label: 'In Kitchen',
          bg: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
          dot: 'bg-amber-400 animate-pulse',
        };
      case 'sent_to_delivery':
        return {
          label: 'Sent to Delivery',
          bg: 'bg-orange-950/60 text-[#ff4500] border-[#ff4500]/50',
          dot: 'bg-[#ff4500] animate-ping',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
          dot: 'bg-emerald-400',
        };

      // Payment Statuses
      case 'paid':
        return {
          label: 'Paid',
          bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
          dot: 'bg-emerald-400',
        };
      case 'failed':
        return {
          label: 'Payment Failed',
          bg: 'bg-red-950/60 text-red-400 border-red-800/60',
          dot: 'bg-red-400',
        };

      // Inventory Statuses
      case 'OK':
        return {
          label: 'In Stock (OK)',
          bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
          dot: 'bg-emerald-400',
        };
      case 'Low':
        return {
          label: 'Low Stock',
          bg: 'bg-yellow-950/60 text-yellow-400 border-yellow-700/60',
          dot: 'bg-yellow-400',
        };
      case 'Critical':
        return {
          label: 'Critical Low',
          bg: 'bg-red-950/80 text-red-400 border-red-700/80',
          dot: 'bg-red-500 animate-pulse',
        };

      // Pizza Menu Badges
      case 'Popular':
        return {
          label: 'Popular',
          bg: 'bg-[#ff4500] text-white border-transparent font-black tracking-wider uppercase',
          dot: 'bg-white',
        };
      case 'Spicy':
        return {
          label: 'Spicy 🔥',
          bg: 'bg-red-600 text-white border-transparent font-black tracking-wider uppercase',
          dot: 'bg-white',
        };
      case "Chef's Pick":
        return {
          label: "Chef's Pick",
          bg: 'bg-amber-500 text-black border-transparent font-black tracking-wider uppercase',
          dot: 'bg-black',
        };
      case 'New':
        return {
          label: 'New',
          bg: 'bg-emerald-500 text-black border-transparent font-black tracking-wider uppercase',
          dot: 'bg-black',
        };

      case 'pending':
      default:
        return {
          label: String(status || 'Pending').replace('_', ' '),
          bg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
          dot: 'bg-neutral-400',
        };
    }
  };

  const { label, bg, dot } = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
    </span>
  );
};

export default StatusBadge;
