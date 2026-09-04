import React from 'react';

interface MarqueeProps {
  text?: string;
  items?: string[];
  speed?: 'fast' | 'normal' | 'slow';
  direction?: 'left' | 'right';
  className?: string;
  itemClassName?: string;
  gap?: 'sm' | 'md' | 'lg';
  repeatCount?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({
  text,
  items,
  speed = 'normal',
  direction = 'left',
  className = '',
  itemClassName = '',
  gap = 'md',
  repeatCount = 8,
}) => {
  const contentList = items || (text ? [text] : ['BLAZING HOT', 'FRESH TO YOUR DOOR', 'ORDER NOW', 'CUSTOM BUILT', 'DELIVERED FAST', 'BLAZE']);

  const durationClasses = {
    fast: 'animate-[marquee_16s_linear_infinite]',
    normal: 'animate-[marquee_26s_linear_infinite]',
    slow: 'animate-[marquee_40s_linear_infinite]',
  };

  const reverseDurationClasses = {
    fast: 'animate-[marquee-reverse_16s_linear_infinite]',
    normal: 'animate-[marquee-reverse_26s_linear_infinite]',
    slow: 'animate-[marquee-reverse_40s_linear_infinite]',
  };

  const animationClass = direction === 'left' ? durationClasses[speed] : reverseDurationClasses[speed];

  const gapClasses = {
    sm: 'gap-6',
    md: 'gap-10',
    lg: 'gap-16',
  };

  // Repeated elements to create a seamless infinite loop
  const repeated = Array.from({ length: repeatCount });

  return (
    <div
      className={`relative w-full overflow-hidden whitespace-nowrap bg-[#ff4500] border-y border-[#ff6b35]/40 py-3.5 select-none shadow-md ${className}`}
    >
      <div className={`flex w-max ${animationClass} ${gapClasses[gap]} items-center`}>
        {repeated.map((_, i) => (
          <React.Fragment key={i}>
            {contentList.map((item, idx) => (
              <span
                key={`${i}-${idx}`}
                className={`flex items-center text-sm md:text-base font-black tracking-widest uppercase text-white transition-colors duration-200 ${itemClassName}`}
              >
                {item}
                <span className="mx-4 inline-block text-white/70 text-xs">✦</span>
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
