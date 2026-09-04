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
      <div className="flex md:hidden items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#f0e6d9] shadow-sm">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#ff4500] uppercase">
            Step {currentStep} of 4
          </span>
          <h4 className="text-base font-black text-[#1a0a00] uppercase tracking-tight">
            {steps[currentStep - 1].title}
          </h4>
        </div>
        <div className="flex gap-1.5">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`h-2 rounded-full transition-all duration-300 ${
                s.step === currentStep
                  ? 'w-6 bg-[#ff4500]'
                  : s.step < currentStep
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-[#f0e6d9]'
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
              className={`group flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 shadow-sm ${
                isActive
                  ? 'border-[#ff4500] bg-[#fff5f0] shadow-[0_0_15px_rgba(255,69,0,0.15)] ring-1 ring-[#ff4500]'
                  : isCompleted
                  ? 'border-[#f0e6d9] bg-white hover:border-[#ff4500]/50 cursor-pointer'
                  : 'border-[#f0e6d9] bg-[#fffaf5] opacity-50 cursor-not-allowed'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg font-black text-xs transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-[#ff4500] text-white'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#f0e6d9] text-[#8a6a50]'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
              </div>

              <div className="overflow-hidden">
                <div
                  className={`text-xs font-black uppercase tracking-tight transition-colors line-clamp-1 ${
                    isActive ? 'text-[#ff4500]' : 'text-[#1a0a00]'
                  }`}
                >
                  {s.title}
                </div>
                <div className="text-[11px] text-[#8a6a50] font-medium">
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
