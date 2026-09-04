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
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subtextSizes = {
    sm: 'text-[8px] tracking-[0.2em]',
    md: 'text-[9px] tracking-[0.22em]',
    lg: 'text-[10px] tracking-[0.25em]',
    xl: 'text-[11px] tracking-[0.28em]',
  };

  const isDarkBg = !darkText;

  const content = (
    <div className={`flex items-center gap-2.5 select-none group ${className}`}>
      {/* Sleek minimal flame pill mark */}
      <div
        className={`${iconSizes[size]} relative flex-shrink-0 rounded-lg ${
          isDarkBg ? 'bg-white text-[#111111]' : 'bg-[#111111] text-white'
        } p-1.5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.63-1.04-2.5-2.5-4-1.46 1.5-2.5 2.37-2.5 4z" fill="currentColor" />
          <path d="M12 2c-3 4-6 7.5-6 12a6 6 0 0 0 12 0c0-4.5-3-8-6-12z" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-serif tracking-tight ${
            isDarkBg ? 'text-[#faf9f6]' : 'text-[#111111]'
          } ${textSizes[size]}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          Blaze
        </span>
        {showSubtext && (
          <span
            className={`font-medium ${
              isDarkBg ? 'text-[#a39e93]' : 'text-[#666666]'
            } uppercase ${subtextSizes[size]} mt-0.5`}
          >
            Wood-Fired
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link to="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
