import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface HeroPizza {
  name: string;
  category: string;
  image: string;
}

const HERO_PIZZAS: HeroPizza[] = [
  {
    name: 'Smoky Truffle Delight',
    category: "Chef's Pick",
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Loaded Pepperoni Curls',
    category: 'Popular',
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Margherita Fior di Latte',
    category: 'Classic',
    image:
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Flame-Grilled BBQ Chicken',
    category: 'Spicy',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Mediterranean Garden Veggie',
    category: 'Fresh',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=80',
  },
];

const AUTO_ROTATE_INTERVAL = 4500; // 4.5 seconds per slide

export const HeroPizzaShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax depth on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2.5, 2.5]);

  // Auto-rotation timer
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_PIZZAS.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isHovered]);

  const currentPizza = HERO_PIZZAS[currentIndex];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-md aspect-square select-none group"
    >
      {/* Outer shadow card with scroll parallax */}
      <motion.div
        style={{ y, rotate }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full overflow-hidden rounded-3xl bg-[#f5f2ed] border border-[#e8e4dd] shadow-[0_20px_50px_rgba(0,0,0,0.08)] will-change-transform"
      >
        {/* Animated Changing Images */}
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentPizza.image}
            src={currentPizza.image}
            alt={currentPizza.name}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover oriente-img-hover"
          />
        </AnimatePresence>

        {/* Subtle Dark Vignette at bottom for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Floating Top Category Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111]/80 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-[#faf9f6] shadow-sm border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d5a27] animate-pulse" />
            {currentPizza.category}
          </span>
        </div>

        {/* Bottom Details Overlay */}
        <div className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3 text-white">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-[#faf9f6]/75 font-medium">
              Featured Crust 0{currentIndex + 1} / 0{HERO_PIZZAS.length}
            </p>
            <h4 className="font-serif text-lg font-normal text-white tracking-tight leading-tight line-clamp-1">
              {currentPizza.name}
            </h4>
          </div>

          {/* Minimal Interactive Slide Indicators */}
          <div className="flex items-center gap-1.5 pb-1">
            {HERO_PIZZAS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to pizza ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-400 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 bg-white shadow-sm'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroPizzaShowcase;
