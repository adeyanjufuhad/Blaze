import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { step: 1, title: 'Choose Base', subtitle: 'Select Crust' },
  { step: 2, title: 'Choose Sauce', subtitle: 'Pick Flavor' },
  { step: 3, title: 'Choose Cheese', subtitle: 'Melting Core' },
  { step: 4, title: 'Vegetables', subtitle: 'Min 1, Max 6' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full py-4">
      {/* Mobile view */}
      <div className="flex md:hidden items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#e8e4dd] shadow-xs">
        <div>
          <span className="text-[10px] font-medium tracking-widest text-[#666666] uppercase">
            Step {currentStep} of 4
          </span>
          <h4 className="font-serif text-base text-[#111111] font-normal">
            {steps[currentStep - 1].title}
          </h4>
        </div>
        <div className="flex gap-1.5">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.step === currentStep
                  ? 'w-6 bg-[#111111]'
                  : s.step < currentStep
                  ? 'w-2 bg-[#2d5a27]'
                  : 'w-2 bg-[#e8e4dd]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:grid grid-cols-4 gap-3">
        {steps.map((s) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isCompleted && !isActive}
              onClick={() => isCompleted && onStepClick && onStepClick(s.step)}
              className={`group flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                isActive
                  ? 'border-[#111111] bg-[#f5f2ed] shadow-xs'
                  : isCompleted
                  ? 'border-[#e8e4dd] bg-white hover:border-[#111111]/40 cursor-pointer'
                  : 'border-[#e8e4dd] bg-[#faf9f6] opacity-50 cursor-not-allowed'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : isCompleted
                    ? 'bg-[#2d5a27] text-white'
                    : 'bg-[#e8e4dd] text-[#666666]'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : s.step}
              </div>

              <div className="overflow-hidden">
                <div
                  className={`text-xs font-medium tracking-tight transition-colors line-clamp-1 ${
                    isActive ? 'text-[#111111] font-semibold' : 'text-[#111111]'
                  }`}
                >
                  {s.title}
                </div>
                <div className="text-[11px] text-[#666666]">
                  {s.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
