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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={`relative flex flex-col text-left overflow-hidden rounded-2xl border p-4 transition-all duration-200 w-full cursor-pointer ${
        isSelected
          ? 'border-[#111111] bg-[#f5f2ed] shadow-xs'
          : 'border-[#e8e4dd] bg-white hover:border-[#111111]/40'
      }`}
    >
      {/* Selection check indicator */}
      <div
        className={`absolute top-3.5 right-3.5 z-10 flex h-5 w-5 items-center justify-center rounded-full transition-all ${
          isSelected
            ? 'bg-[#111111] text-white'
            : 'border border-[#e8e4dd] bg-white text-transparent'
        }`}
      >
        <Check className="h-3 w-3 stroke-[2.5]" />
      </div>

      {/* Option Image if present */}
      {option.image && (
        <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl bg-[#faf9f6]">
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
              className={`font-serif text-base font-normal tracking-tight transition-colors ${
                isSelected ? 'text-[#111111] font-medium' : 'text-[#111111]'
              }`}
            >
              {option.name}
            </h4>
          </div>

          {option.description && (
            <p className="text-xs text-[#666666] mt-1 line-clamp-2 leading-relaxed">
              {option.description}
            </p>
          )}
        </div>

        {/* Price modifier tag */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#e8e4dd]">
          <span className="text-[10px] uppercase tracking-wider text-[#888888]">
            {isMultiSelect ? 'Topping' : 'Option'}
          </span>
          <span className="text-xs font-medium text-[#111111]">
            {option.priceModifier > 0 ? `+₦${option.priceModifier.toLocaleString()}` : 'Included'}
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default BuilderCard;
