import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappy spring for inner pinpoint dot
  const dotX = useSpring(mouseX, { stiffness: 850, damping: 40 });
  const dotY = useSpring(mouseY, { stiffness: 850, damping: 40 });

  // Elastic lagging spring for outer follower ring
  const ringX = useSpring(mouseX, { stiffness: 260, damping: 22 });
  const ringY = useSpring(mouseY, { stiffness: 260, damping: 22 });

  const activeElementRef = useRef<Element | null>(null);

  useEffect(() => {
    // Detect touch primary devices to cleanly disable custom cursor
    if (typeof window !== 'undefined') {
      const isTouchDevice =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      if (isTouchDevice) {
        setIsTouch(true);
        return;
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, [role="button"], input, select, textarea, label, [data-cursor="pointer"], .cursor-pointer'
        );
        setIsHovered(!!interactive);
        activeElementRef.current = interactive;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouch) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Outer Follower Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.7 : 1,
          borderColor: isHovered ? '#2d5a27' : 'rgba(17, 17, 17, 0.4)',
          backgroundColor: isHovered ? 'rgba(45, 90, 39, 0.08)' : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#111111]/40 will-change-transform"
      />

      {/* Inner Pinpoint Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 0.6 : 1,
          backgroundColor: isHovered ? '#2d5a27' : '#111111',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#111111] will-change-transform"
      />
    </div>
  );
};

export default CustomCursor;
