import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
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
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e8e4dd] bg-white p-4 transition-all duration-300 hover:border-[#111111]/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${className}`}
    >
      {/* Image Container with Badges and Slide-up CTA */}
      <div className="relative mb-3.5 h-56 w-full overflow-hidden rounded-xl bg-[#faf9f6]">
        <img
          src={pizza.image}
          alt={pizza.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Floating badge top-left: dark pill */}
        {pizza.badge && (
          <div className="absolute top-3 left-3 z-10">
            <StatusBadge status={pizza.badge} showDot={false} />
          </div>
        )}

        {/* Price pill top-right: subtle dark pill */}
        <div className="absolute top-3 right-3 z-10 rounded-full bg-[#111111] px-3 py-1 text-xs font-medium text-white shadow-sm">
          ₦{pizza.basePrice.toLocaleString()}
        </div>

        {/* Slide-up "Add to bag" button on hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#2d5a27] hover:bg-[#23471f] py-2.5 text-xs font-medium text-white shadow-md transition-colors cursor-pointer"
            aria-label={`Add ${pizza.name} to bag`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add to bag</span>
          </button>
        </div>
      </div>

      {/* Title & Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="font-serif text-lg text-[#111111] font-normal tracking-tight group-hover:opacity-80 transition-opacity line-clamp-1">
              {pizza.name}
            </h3>
          </div>

          <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed mb-3">
            {pizza.description}
          </p>
        </div>

        {/* Bottom meta */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#e8e4dd]/70 mt-auto text-xs">
          <span className="text-[11px] font-medium tracking-wide uppercase text-[#888888]">
            {pizza.category}
          </span>
          <span className="font-medium text-[#111111]">
            ₦{pizza.basePrice.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
};
export default PizzaCard;
