import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { CustomizationOption } from '../../types';

interface BuilderCardProps {
  option: CustomizationOption;
  isSelected: boolean;
  onSelect: () => void;
  isMultiSelect?: boolean;
}

export const BuilderCard: React.FC<BuilderCardProps> = ({
  option,
  isSelected,
  onSelect,
  isMultiSelect = false,
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative flex flex-col text-left overflow-hidden rounded-2xl border p-4 transition-all duration-300 w-full cursor-pointer shadow-sm ${
        isSelected
          ? 'border-[#ff4500] bg-[#fff5f0] shadow-[0_0_20px_rgba(255,69,0,0.18)] ring-1 ring-[#ff4500]'
          : 'border-[#f0e6d9] bg-white hover:border-[#ff4500]/50 hover:bg-[#fffaf5]'
      }`}
    >
      {/* Selection check indicator */}
      <div
        className={`absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all ${
          isSelected
            ? 'bg-[#ff4500] text-white shadow-md'
            : 'border border-[#f0e6d9] bg-white text-transparent'
        }`}
      >
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </div>

      {/* Option Image if present */}
      {option.image && (
        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-xl bg-[#fffaf5] border border-[#f0e6d9]">
          <img
            src={option.image}
            alt={option.name}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      )}

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 pr-6">
            <h4
              className={`font-black text-base md:text-lg uppercase tracking-tight transition-colors ${
                isSelected ? 'text-[#ff4500]' : 'text-[#1a0a00]'
              }`}
            >
              {option.name}
            </h4>
          </div>

          {option.description && (
            <p className="text-xs text-[#8a6a50] mt-1 line-clamp-2 leading-relaxed">
              {option.description}
            </p>
          )}
        </div>

        {/* Price modifier tag */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#f0e6d9]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8a6a50]">
            {isMultiSelect ? 'Topping' : 'Option'}
          </span>
          <span
            className={`text-xs font-black uppercase ${
              option.priceModifier > 0 ? 'text-[#ff4500]' : 'text-[#8a6a50]'
            }`}
          >
            {option.priceModifier > 0 ? `+₦${option.priceModifier.toLocaleString()}` : 'Included'}
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default BuilderCard;
