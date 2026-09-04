import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Pizza } from '../../types';
import { StatusBadge } from './StatusBadge';
import { useCartStore } from '../../store/useCartStore';

interface PizzaCardProps {
  pizza: Pizza;
  className?: string;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, className = '' }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      pizzaId: pizza._id,
      name: pizza.name,
      image: pizza.image,
      isCustom: false,
      price: pizza.basePrice,
      quantity: 1,
    });
  };

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#f0e6d9] bg-white p-4 transition-all duration-300 shadow-[0_2px_20px_rgba(255,69,0,0.08)] hover:border-[#ff4500]/50 hover:shadow-[0_8px_30px_rgba(255,69,0,0.16)] ${className}`}
    >
      {/* Background kinetic text watermark */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 select-none overflow-hidden opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]"
        aria-hidden="true"
      >
        <div className="text-4xl font-black uppercase text-[#1a0a00] whitespace-nowrap leading-none tracking-tighter">
          {pizza.name} · {pizza.name} · {pizza.name}
        </div>
      </div>

      {/* Image & Badges */}
      <div className="relative mb-4 h-52 w-full overflow-hidden rounded-xl bg-[#fffaf5]">
        <img
          src={pizza.image}
          alt={pizza.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108 group-hover:rotate-1"
        />

        {/* Floating badge */}
        {pizza.badge && (
          <div className="absolute top-3 left-3 z-10">
            <StatusBadge status={pizza.badge} showDot={false} />
          </div>
        )}

        {/* Quick price tag over image */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-black/80 px-3 py-1 text-sm font-black text-white backdrop-blur-md border border-white/10 shadow-md">
          <span className="text-[#ff4500]">₦</span>
          {pizza.basePrice.toLocaleString()}
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex flex-1 flex-col justify-between z-10">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-[#1a0a00] group-hover:text-[#ff4500] transition-colors line-clamp-1">
              {pizza.name}
            </h3>
          </div>

          <p className="text-xs md:text-sm text-[#8a6a50] line-clamp-2 leading-relaxed mb-4">
            {pizza.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-[#f0e6d9] mt-auto">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8a6a50]">
            {pizza.category}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 rounded-xl bg-[#ff4500] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#e03800] hover:shadow-lg hover:shadow-[#ff4500]/30 active:scale-95 cursor-pointer"
            aria-label={`Add ${pizza.name} to bag`}
          >
            <span>Add to Bag</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default PizzaCard;
