import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-[#f0e6d9] bg-white shadow-sm ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#fffaf5] border border-[#f0e6d9] flex items-center justify-center text-[#ff4500] mb-5 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl md:text-2xl font-black text-[#1a0a00] tracking-tight uppercase mb-2">
        {title}
      </h3>

      <p className="text-sm md:text-base text-[#8a6a50] max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && (actionLink || onAction) && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-extrabold uppercase text-xs tracking-wider transition-all duration-200 shadow-md shadow-[#ff4500]/25 hover:shadow-[#ff4500]/40 active:scale-95"
          >
            {actionText}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-extrabold uppercase text-xs tracking-wider transition-all duration-200 shadow-md shadow-[#ff4500]/25 hover:shadow-[#ff4500]/40 active:scale-95"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
