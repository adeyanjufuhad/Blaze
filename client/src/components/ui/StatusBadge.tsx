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
          bg: 'bg-[#faf9f6] text-[#666666] border-[#e8e4dd]',
          dot: 'bg-[#666666]',
        };
      case 'in_kitchen':
        return {
          label: 'In Kitchen',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-600 animate-pulse',
        };
      case 'sent_to_delivery':
        return {
          label: 'Out for Delivery',
          bg: 'bg-emerald-50 text-[#2d5a27] border-emerald-200',
          dot: 'bg-[#2d5a27] animate-pulse',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          bg: 'bg-[#f5f2ed] text-[#111111] border-[#e8e4dd]',
          dot: 'bg-[#2d5a27]',
        };

      // Payment Statuses
      case 'paid':
        return {
          label: 'Paid',
          bg: 'bg-emerald-50 text-[#2d5a27] border-emerald-200',
          dot: 'bg-[#2d5a27]',
        };
      case 'failed':
        return {
          label: 'Payment Failed',
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
        };

      // Inventory Statuses
      case 'OK':
        return {
          label: 'In Stock',
          bg: 'bg-emerald-50 text-[#2d5a27] border-emerald-200',
          dot: 'bg-[#2d5a27]',
        };
      case 'Low':
        return {
          label: 'Low Stock',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-600',
        };
      case 'Critical':
        return {
          label: 'Critical Low',
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-600 animate-pulse',
        };

      // Pizza Menu Badges: Oriente dark pill
      case 'Popular':
        return {
          label: 'Popular',
          bg: 'bg-[#111111] text-white border-transparent font-medium',
          dot: 'bg-white',
        };
      case 'Spicy':
        return {
          label: 'Spicy',
          bg: 'bg-[#111111] text-white border-transparent font-medium',
          dot: 'bg-white',
        };
      case "Chef's Pick":
        return {
          label: "Chef's Pick",
          bg: 'bg-[#111111] text-white border-transparent font-medium',
          dot: 'bg-white',
        };
      case 'New':
        return {
          label: 'New',
          bg: 'bg-[#2d5a27] text-white border-transparent font-medium',
          dot: 'bg-white',
        };

      case 'pending':
      default:
        return {
          label: String(status || 'Pending').replace('_', ' '),
          bg: 'bg-[#faf9f6] text-[#666666] border-[#e8e4dd]',
          dot: 'bg-[#888888]',
        };
    }
  };

  const { label, bg, dot } = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${bg} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
    </span>
  );
};

export default StatusBadge;
