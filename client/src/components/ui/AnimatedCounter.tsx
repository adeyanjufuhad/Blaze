import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.6,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [displayNumber, setDisplayNumber] = useState('0');

  const count = useMotionValue(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier easeOut
      onUpdate: (latest) => {
        const formatted =
          decimals > 0
            ? latest.toFixed(decimals)
            : Math.round(latest).toLocaleString();
        setDisplayNumber(formatted);
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, decimals, count]);

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <span>{displayNumber}</span>
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};

export default AnimatedCounter;
