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
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-[#e8e4dd] bg-white ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-[#faf9f6] border border-[#e8e4dd] flex items-center justify-center text-[#666666] mb-5">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>

      <h3 className="font-serif text-xl md:text-2xl font-normal text-[#111111] tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-xs md:text-sm text-[#666666] max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && (actionLink || onAction) && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white text-xs font-medium tracking-wide transition-colors"
          >
            {actionText}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
