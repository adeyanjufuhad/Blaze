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
  darkText = false,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const subtextSizes = {
    sm: 'text-[9px] tracking-[0.2em]',
    md: 'text-[10px] tracking-[0.22em]',
    lg: 'text-[11px] tracking-[0.25em]',
    xl: 'text-xs tracking-[0.3em]',
  };

  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Orange-red rounded square with white flame icon above faint pizza ellipse */}
      <div
        className={`${iconSizes[size]} relative flex-shrink-0 rounded-xl bg-gradient-to-br from-[#ff4500] to-[#e03800] p-1.5 shadow-lg shadow-[#ff4500]/30 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[#ff4500]/50`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Faint pizza ellipse */}
          <ellipse
            cx="50"
            cy="76"
            rx="38"
            ry="11"
            fill="#ffffff"
            fillOpacity="0.22"
          />
          <ellipse
            cx="50"
            cy="76"
            rx="30"
            ry="7"
            fill="#ffffff"
            fillOpacity="0.3"
          />

          {/* White flame icon */}
          <path
            d="M50 14 C43 28 32 37 32 54 C32 67 40 76 50 76 C60 76 68 67 68 54 C68 40 60 30 55 24 C54 30 52 34 49 37 C48 30 49 22 50 14 Z"
            fill="#ffffff"
          />
          {/* Inner core flame accent */}
          <path
            d="M50 44 C46 50 43 54 43 62 C43 68 46 71 50 71 C54 71 57 68 57 62 C57 56 54 51 50 44 Z"
            fill="#ffcc00"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-black ${darkText ? 'text-[#1a0a00]' : 'text-white'} ${textSizes[size]} tracking-tighter uppercase`}
          style={{ letterSpacing: '-0.05em' }}
        >
          BLAZE
        </span>
        {showSubtext && (
          <span
            className={`font-extrabold text-[#ff4500] uppercase ${subtextSizes[size]} mt-0.5`}
          >
            PIZZA · DELIVERED
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link to="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#ff4500] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
