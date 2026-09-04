import React, { useRef, useEffect, useState, useMemo } from 'react';

interface MarqueeProps {
  text?: string;
  items?: string[];
  speed?: 'fast' | 'normal' | 'slow';
  direction?: 'left' | 'right';
  className?: string;
  itemClassName?: string;
  gap?: 'sm' | 'md' | 'lg';
  repeatCount?: number;
  pauseOnHover?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
  text,
  items,
  speed = 'normal',
  direction = 'left',
  className = '',
  itemClassName = '',
  gap = 'md',
  repeatCount,
  pauseOnHover = false,
}) => {
  const contentList = useMemo(() => {
    return (
      items ||
      (text
        ? [text]
        : [
            'FRESH TO YOUR DOOR',
            'ORDER NOW',
            'CUSTOM BUILT',
            'DELIVERED FAST',
            'BLAZE',
            'BLAZING HOT',
          ])
    );
  }, [items, text]);

  // Ensure enough items in one set so it spans comfortably wide
  const repeatedList = useMemo(() => {
    // Ensure at least ~8-12 items per set so setWidth is comfortably large
    const count = repeatCount || Math.max(2, Math.ceil(10 / contentList.length));
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(...contentList);
    }
    return list;
  }, [contentList, repeatCount]);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  const [setWidth, setSetWidth] = useState(0);
  const isHoveredRef = useRef(false);
  const xRef = useRef(0);
  const speedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Speed in pixels per second: calm editorial pace, slowing down even further on hover
  const speedConfig = useMemo(() => {
    const baseSpeeds = {
      slow: 18,
      normal: 28,
      fast: 44,
    };
    const base = baseSpeeds[speed] || 28;
    // When hovered: 4x slower gentle crawl (~7 px/s)
    const hover = pauseOnHover ? 0 : Math.max(6, base * 0.25);
    return { base, hover };
  }, [speed, pauseOnHover]);

  // Measure single set width with ResizeObserver
  useEffect(() => {
    if (!setRef.current) return;

    const updateWidth = () => {
      if (setRef.current) {
        const width = setRef.current.getBoundingClientRect().width;
        if (width > 0) {
          setSetWidth(width);
        }
      }
    };

    updateWidth();

    const ro = new ResizeObserver(() => {
      updateWidth();
    });

    ro.observe(setRef.current);
    return () => ro.disconnect();
  }, [repeatedList, gap]);

  // Initialize xRef when setWidth is first measured for right-direction
  useEffect(() => {
    if (direction === 'right' && setWidth > 0 && xRef.current === 0) {
      xRef.current = -setWidth;
    }
  }, [direction, setWidth]);

  // Continuous animation loop with smooth lerp deceleration/acceleration
  useEffect(() => {
    speedRef.current = speedConfig.base;
    lastTimeRef.current = null;

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }

      // Delta time in seconds, clamped to avoid jumps when tab is inactive or throttled
      const rawDt = (time - lastTimeRef.current) / 1000;
      const dt = Math.min(rawDt, 0.05);
      lastTimeRef.current = time;

      // Smooth deceleration/acceleration toward target speed (inertial easing)
      const targetSpeed = isHoveredRef.current ? speedConfig.hover : speedConfig.base;
      const lerpFactor = 1 - Math.exp(-4.5 * dt);
      speedRef.current += (targetSpeed - speedRef.current) * lerpFactor;

      const dirMultiplier = direction === 'left' ? -1 : 1;
      xRef.current += dirMultiplier * speedRef.current * dt;

      // Seamless wrap-around
      if (setWidth > 0) {
        if (direction === 'left') {
          while (xRef.current <= -setWidth) {
            xRef.current += setWidth;
          }
          while (xRef.current > 0) {
            xRef.current -= setWidth;
          }
        } else {
          while (xRef.current >= 0) {
            xRef.current -= setWidth;
          }
          while (xRef.current < -setWidth) {
            xRef.current += setWidth;
          }
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [speedConfig, direction, setWidth]);

  const gapClasses = {
    sm: 'gap-6 pr-6',
    md: 'gap-10 pr-10',
    lg: 'gap-16 pr-16',
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onTouchStart={() => {
        isHoveredRef.current = true;
      }}
      onTouchEnd={() => {
        isHoveredRef.current = false;
      }}
      className={`relative w-full overflow-hidden whitespace-nowrap bg-[#111111] border-y border-[#222222] py-3.5 select-none transition-colors duration-300 ${className}`}
    >
      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
      >
        {/* Set A (measured) */}
        <div
          ref={setRef}
          className={`flex shrink-0 items-center ${gapClasses[gap]}`}
        >
          {repeatedList.map((item, idx) => (
            <span
              key={`a-${idx}`}
              className={`flex items-center text-xs md:text-sm font-medium tracking-widest uppercase text-[#faf9f6] transition-colors duration-200 hover:text-white ${itemClassName}`}
            >
              {item}
              <span className="mx-4 inline-block text-[#666666] text-xs">✦</span>
            </span>
          ))}
        </div>

        {/* Set B (duplicate 1) */}
        <div
          aria-hidden="true"
          className={`flex shrink-0 items-center ${gapClasses[gap]}`}
        >
          {repeatedList.map((item, idx) => (
            <span
              key={`b-${idx}`}
              className={`flex items-center text-xs md:text-sm font-medium tracking-widest uppercase text-[#faf9f6] transition-colors duration-200 hover:text-white ${itemClassName}`}
            >
              {item}
              <span className="mx-4 inline-block text-[#666666] text-xs">✦</span>
            </span>
          ))}
        </div>

        {/* Set C (duplicate 2 for ultra-wide screen coverage) */}
        <div
          aria-hidden="true"
          className={`flex shrink-0 items-center ${gapClasses[gap]}`}
        >
          {repeatedList.map((item, idx) => (
            <span
              key={`c-${idx}`}
              className={`flex items-center text-xs md:text-sm font-medium tracking-widest uppercase text-[#faf9f6] transition-colors duration-200 hover:text-white ${itemClassName}`}
            >
              {item}
              <span className="mx-4 inline-block text-[#666666] text-xs">✦</span>
            </span>
          ))}
        </div>

        {/* Set D (duplicate 3 for ultra-wide screen coverage) */}
        <div
          aria-hidden="true"
          className={`flex shrink-0 items-center ${gapClasses[gap]}`}
        >
          {repeatedList.map((item, idx) => (
            <span
              key={`d-${idx}`}
              className={`flex items-center text-xs md:text-sm font-medium tracking-widest uppercase text-[#faf9f6] transition-colors duration-200 hover:text-white ${itemClassName}`}
            >
              {item}
              <span className="mx-4 inline-block text-[#666666] text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
