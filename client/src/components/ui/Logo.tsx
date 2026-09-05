import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showSubtext?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLink?: boolean;
  darkText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showSubtext = true,
  size = 'md',
  isLink = true,
  darkText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const subtextSizes = {
    sm: 'text-[7px] tracking-[0.2em]',
    md: 'text-[8.5px] tracking-[0.22em]',
    lg: 'text-[10px] tracking-[0.24em]',
    xl: 'text-[11.5px] tracking-[0.26em]',
  };

  const dividerHeights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  };

  const isDarkBg = !darkText;

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none group ${className}`}>
      {/* Precision squircle emblem mark */}
      <div
        className={`${iconSizes[size]} relative flex-shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105 ${
          isDarkBg ? 'ring-1 ring-white/15' : 'ring-1 ring-black/5'
        }`}
      >
        <img
          src="/logo-mark.png"
          alt="Blaze"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      </div>

      {/* Vertical hairline divider */}
      <div
        className={`w-px ${dividerHeights[size]} ${
          isDarkBg ? 'bg-white/20' : 'bg-[#ded8ce]'
        } flex-shrink-0 transition-colors`}
      />

      {/* Typography: BLAZE + PIZZA · DELIVERED */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-serif font-bold uppercase tracking-tight ${
            isDarkBg ? 'text-[#faf9f6]' : 'text-[#111111]'
          } ${textSizes[size]}`}
          style={{ letterSpacing: '0.04em' }}
        >
          BLAZE
        </span>
        {showSubtext && (
          <span
            className={`font-sans font-semibold uppercase ${subtextSizes[size]} text-[#c7a97b] mt-1 whitespace-nowrap`}
          >
            PIZZA · DELIVERED
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link
        to="/"
        className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
