import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Pizza } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { Magnetic } from './Magnetic';
import { TextScramble } from './TextScramble';

interface MarqueeProductSectionProps {
  pizza: Pizza;
  tagline?: string;
  reverseMarquee?: boolean;
}

export const MarqueeProductSection: React.FC<MarqueeProductSectionProps> = ({
  pizza,
  tagline = "Chef's Signature Selection",
  reverseMarquee = false,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const pizzaY = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const pizzaRotate = useTransform(
    scrollYProgress,
    [0, 1],
    reverseMarquee ? [4, -4] : [-4, 4]
  );

  const handleAddToCart = () => {
    addItem({
      pizzaId: pizza._id,
      name: pizza.name,
      image: pizza.image,
      isCustom: false,
      price: pizza.basePrice,
      quantity: 1,
    });
  };

  const repeatedText = `${pizza.name.toUpperCase()} · `.repeat(8);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#faf9f6] py-20 md:py-28 border-y border-[#e8e4dd] select-none"
    >
      {/* 3-Row Background Infinite Kinetic Marquee */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 md:gap-4 opacity-[0.4] overflow-hidden -z-0">
        {/* Row 1: Fast (20s) */}
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee-fast flex shrink-0 items-center">
            <span className="text-5xl md:text-8xl lg:text-9xl font-serif tracking-tight text-[#d5cfc4] font-normal px-4">
              {repeatedText}
            </span>
          </div>
          <div className="animate-marquee-fast flex shrink-0 items-center">
            <span className="text-5xl md:text-8xl lg:text-9xl font-serif tracking-tight text-[#d5cfc4] font-normal px-4">
              {repeatedText}
            </span>
          </div>
        </div>

        {/* Row 2: Slow (35s) Reverse */}
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee-reverse-slow flex shrink-0 items-center">
            <span className="text-5xl md:text-8xl lg:text-9xl font-serif tracking-tight text-[#ded9cf] font-normal px-4">
              {repeatedText}
            </span>
          </div>
          <div className="animate-marquee-reverse-slow flex shrink-0 items-center">
            <span className="text-5xl md:text-8xl lg:text-9xl font-serif tracking-tight text-[#ded9cf] font-normal px-4">
              {repeatedText}
            </span>
          </div>
        </div>

        {/* Row 3: Medium (25s) */}
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center">
            <span className="text-5xl md:text-8xl lg:text-9xl font-serif tracking-tight text-[#d5cfc4] font-normal px-4">
              {repeatedText}
            </span>
          </div>
          <div className="animate-marquee flex shrink-0 items-center">
            <span className="text-5xl md:text-8xl lg:text-9xl font-serif tracking-tight text-[#d5cfc4] font-normal px-4">
              {repeatedText}
            </span>
          </div>
        </div>
      </div>

      {/* Foreground Content: Centered Pizza & Details */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Tagline Pill */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-4 py-1 text-xs font-medium text-[#faf9f6]">
            <span>{tagline}</span>
          </div>

          {/* Centered Large High-Res Product Image with Scroll Parallax */}
          <motion.div
            style={{ y: pizzaY, rotate: pizzaRotate }}
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative my-4 h-64 sm:h-80 md:h-96 w-64 sm:w-80 md:w-96 cursor-pointer will-change-transform"
          >
            <img
              src={pizza.image}
              alt={pizza.name}
              className="h-full w-full object-cover rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>

          {/* Product Details */}
          <div className="mt-4 max-w-lg space-y-2">
            <h3 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
              {pizza.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              {pizza.description}
            </p>

            {/* Price and CTA */}
            <div className="pt-4 flex items-center justify-center gap-4">
              <span className="text-lg font-medium text-[#111111]">
                ₦{pizza.basePrice.toLocaleString()}
              </span>
              <Magnetic strength={0.35}>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center gap-2 rounded-full bg-[#111111] hover:bg-[#2d5a27] px-6 py-2.5 text-xs font-medium text-white transition-colors cursor-pointer shadow-sm"
                >
                  <TextScramble text="Add to Bag" />
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarqueeProductSection;
