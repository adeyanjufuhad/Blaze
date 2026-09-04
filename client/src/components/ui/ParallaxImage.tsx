import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  offset?: number;
  rotateRange?: number;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  offset = 35,
  rotateRange = 3,
  className = '',
  imgClassName = '',
  aspectRatio = 'aspect-square',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-rotateRange, rotateRange]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectRatio} ${className}`}
    >
      <motion.div
        style={{ y, rotate }}
        className="w-full h-full flex items-center justify-center will-change-transform"
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 ease-out ${imgClassName}`}
        />
      </motion.div>
    </div>
  );
};

export default ParallaxImage;
