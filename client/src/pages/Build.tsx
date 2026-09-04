import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Flame, ShoppingBag, RotateCcw } from 'lucide-react';
import { StepIndicator } from '../components/ui/StepIndicator';
import { BuilderCard } from '../components/ui/BuilderCard';
import { toast } from '../components/ui/Toast';
import { useBuilderStore } from '../store/useBuilderStore';
import { useCartStore } from '../store/useCartStore';
import { CustomizationOption } from '../types';
import api from '../lib/api';

export const Build: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    selections,
    setStep,
    nextStep,
    prevStep,
    selectBase,
    selectSauce,
    selectCheese,
    toggleVegetable,
    calculateTotal,
    canProceedToNextStep,
    resetBuilder,
    basePrice,
  } = useBuilderStore();

  const addItem = useCartStore((state) => state.addItem);

  const [options, setOptions] = useState<{
    base: CustomizationOption[];
    sauce: CustomizationOption[];
    cheese: CustomizationOption[];
    vegetable: CustomizationOption[];
  }>({
    base: [],
    sauce: [],
    cheese: [],
    vegetable: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/api/customization');
        if (res.data?.grouped) {
          setOptions(res.data.grouped);
        }
      } catch (err) {
        console.warn('Using fallback builder customization options:', err);
        // Fallback default options matching prompt specification
        setOptions({
          base: [
            { _id: 'b1', type: 'base', name: 'Classic Thin', description: 'Crisp Roman hand-tossed dough', priceModifier: 0, isAvailable: true },
            { _id: 'b2', type: 'base', name: 'Thick Pan', description: 'Deep-dish crust with airy crumb', priceModifier: 500, isAvailable: true },
            { _id: 'b3', type: 'base', name: 'Stuffed Crust', description: 'Crust filled with molten mozzarella strings', priceModifier: 1000, isAvailable: true },
            { _id: 'b4', type: 'base', name: 'Whole Wheat', description: 'Nutty, high-fiber, rustic dough', priceModifier: 600, isAvailable: true },
            { _id: 'b5', type: 'base', name: 'Gluten Free', description: 'Crispy cauliflower-blend crust', priceModifier: 1200, isAvailable: true },
          ],
          sauce: [
            { _id: 's1', type: 'sauce', name: 'Tomato', description: 'San Marzano slow-simmered marinara', priceModifier: 0, isAvailable: true },
            { _id: 's2', type: 'sauce', name: 'BBQ', description: 'Mesquite glaze with brown sugar notes', priceModifier: 300, isAvailable: true },
            { _id: 's3', type: 'sauce', name: 'Pesto', description: 'Fresh basil, garlic and olive oil', priceModifier: 500, isAvailable: true },
            { _id: 's4', type: 'sauce', name: 'Alfredo', description: 'Velvety cream with parmesan cheese', priceModifier: 400, isAvailable: true },
            { _id: 's5', type: 'sauce', name: 'Spicy Arrabbiata', description: 'Fiery roasted garlic and red chilies', priceModifier: 300, isAvailable: true },
          ],
          cheese: [
            { _id: 'c1', type: 'cheese', name: 'Mozzarella', description: 'Whole-milk low moisture mozzarella', priceModifier: 0, isAvailable: true },
            { _id: 'c2', type: 'cheese', name: 'Cheddar', description: 'Sharp aged Wisconsin orange cheddar', priceModifier: 400, isAvailable: true },
            { _id: 'c3', type: 'cheese', name: 'Vegan Cheese', description: '100% plant-based cashew melt blend', priceModifier: 600, isAvailable: true },
          ],
          vegetable: [
            { _id: 'v1', type: 'vegetable', name: 'Bell Peppers', description: 'Crisp green & red bell peppers', priceModifier: 200, isAvailable: true },
            { _id: 'v2', type: 'vegetable', name: 'Mushrooms', description: 'Sliced button mushrooms', priceModifier: 250, isAvailable: true },
            { _id: 'v3', type: 'vegetable', name: 'Olives', description: 'Kalamata sliced black olives', priceModifier: 200, isAvailable: true },
            { _id: 'v4', type: 'vegetable', name: 'Onions', description: 'Thinly sliced sweet red onions', priceModifier: 150, isAvailable: true },
            { _id: 'v5', type: 'vegetable', name: 'Jalapeños', description: 'Zesty pickling spicy coins', priceModifier: 250, isAvailable: true },
            { _id: 'v6', type: 'vegetable', name: 'Corn', description: 'Golden sunburst sweetcorn', priceModifier: 200, isAvailable: true },
            { _id: 'v7', type: 'vegetable', name: 'Spinach', description: 'Fresh baby spinach leaves', priceModifier: 200, isAvailable: true },
            { _id: 'v8', type: 'vegetable', name: 'Tomatoes', description: 'Roasted cherry tomato halves', priceModifier: 200, isAvailable: true },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleToggleVegetable = (option: CustomizationOption) => {
    const res = toggleVegetable(option);
    if (!res.success && res.message) {
      toast.error(res.message);
    }
  };

  const handleAddToCart = () => {
    if (selections.vegetables.length < 1) {
      toast.error('Please pick at least 1 vegetable topping before adding to cart');
      return;
    }

    const total = calculateTotal();
    const vegNames = selections.vegetables.map((v) => v.name);

    addItem({
      name: `Custom Blaze (${selections.base?.name || 'Handcrafted'})`,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      isCustom: true,
      customization: {
        base: selections.base?.name || 'Classic Thin',
        sauce: selections.sauce?.name || 'Tomato',
        cheese: selections.cheese?.name || 'Mozzarella',
        vegetables: vegNames,
      },
      price: total,
      quantity: 1,
    });

    toast.success('Custom pizza added to your bag!');
  };

  const totalCalculated = calculateTotal();

  return (
    <div className="min-h-screen bg-[#fffaf5] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#ff4500]">
            Custom Pizza Studio
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#1a0a00] mt-1">
            Build Your Pizza
          </h1>
        </div>

        <button
          type="button"
          onClick={resetBuilder}
          className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#f0e6d9] bg-white text-xs font-bold text-[#8a6a50] hover:text-[#1a0a00] hover:border-[#ff4500] shadow-sm transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Selections</span>
        </button>
      </div>

      {/* Step Indicator Header */}
      <StepIndicator currentStep={currentStep} onStepClick={(step) => setStep(step)} />

      {/* Main Layout: Builder Steps + Order Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Step Content Panels (Animated Framer Motion) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Base */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#1a0a00]">
                    Step 1: Choose Your Base Crust
                  </h3>
                  <p className="text-sm text-[#8a6a50] mt-1">
                    Select the foundational dough for your pizza.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {options.base.map((option) => (
                    <BuilderCard
                      key={option._id}
                      option={option}
                      isSelected={selections.base?._id === option._id || selections.base?.name === option.name}
                      onSelect={() => selectBase(option)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Sauce */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#1a0a00]">
                    Step 2: Choose Your Sauce
                  </h3>
                  <p className="text-sm text-[#8a6a50] mt-1">
                    Pick your signature sauce base simmered to perfection.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {options.sauce.map((option) => (
                    <BuilderCard
                      key={option._id}
                      option={option}
                      isSelected={selections.sauce?._id === option._id || selections.sauce?.name === option.name}
                      onSelect={() => selectSauce(option)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Cheese */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#1a0a00]">
                    Step 3: Choose Your Cheese
                  </h3>
                  <p className="text-sm text-[#8a6a50] mt-1">
                    Select your melting layer of dairy or plant-based indulgence.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {options.cheese.map((option) => (
                    <BuilderCard
                      key={option._id}
                      option={option}
                      isSelected={selections.cheese?._id === option._id || selections.cheese?.name === option.name}
                      onSelect={() => selectCheese(option)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Vegetables */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-[#1a0a00]">
                      Step 4: Choose Vegetables
                    </h3>
                    <p className="text-sm text-[#8a6a50] mt-1">
                      Multi-select fresh farm toppings (Minimum 1, Maximum 6).
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#fff5f0] border border-[#ff4500]/30 text-xs font-bold text-[#ff4500] self-start">
                    {selections.vegetables.length}/6 Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {options.vegetable.map((option) => {
                    const isSelected = selections.vegetables.some(
                      (v) => v._id === option._id || v.name === option.name
                    );
                    return (
                      <BuilderCard
                        key={option._id}
                        option={option}
                        isSelected={isSelected}
                        isMultiSelect={true}
                        onSelect={() => handleToggleVegetable(option)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-[#f0e6d9] mt-8">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={prevStep}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-colors ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed bg-transparent text-[#8a6a50] border-[#f0e6d9]'
                  : 'bg-white text-[#1a0a00] border-[#f0e6d9] hover:bg-[#fff5f0] shadow-sm'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                disabled={!canProceedToNextStep()}
                onClick={nextStep}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-lg ${
                  canProceedToNextStep()
                    ? 'bg-[#ff4500] text-white hover:bg-[#e03800] shadow-[#ff4500]/30 active:scale-95'
                    : 'bg-[#f0e6d9] text-[#8a6a50] cursor-not-allowed shadow-none'
                }`}
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={selections.vegetables.length < 1}
                onClick={handleAddToCart}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-xl ${
                  selections.vegetables.length >= 1
                    ? 'bg-[#ff4500] text-white hover:bg-[#e03800] shadow-[#ff4500]/40 active:scale-95'
                    : 'bg-[#f0e6d9] text-[#8a6a50] cursor-not-allowed shadow-none'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Pizza to Bag</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 rounded-2xl border border-[#f0e6d9] bg-white p-6 space-y-6 shadow-blaze-card">
            <div className="flex items-center justify-between border-b border-[#f0e6d9] pb-4">
              <h3 className="font-black text-lg uppercase tracking-tight text-[#1a0a00] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#ff4500]" />
                <span>Live Pizza Summary</span>
              </h3>
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-[#fff5f0] text-[#ff4500] border border-[#ff4500]/20">
                Step {currentStep}/4
              </span>
            </div>

            {/* Visual breakdown */}
            <div className="space-y-4 text-xs">
              {/* Base */}
              <div className="flex justify-between items-center pb-2 border-b border-[#f0e6d9]">
                <div>
                  <span className="text-[#8a6a50] uppercase font-black block">Base Crust</span>
                  <span className="font-bold text-[#1a0a00] text-sm">
                    {selections.base ? selections.base.name : 'Not chosen yet'}
                  </span>
                </div>
                <span className="font-extrabold text-[#8a6a50]">
                  {selections.base && selections.base.priceModifier > 0
                    ? `+₦${selections.base.priceModifier}`
                    : '₦0'}
                </span>
              </div>

              {/* Sauce */}
              <div className="flex justify-between items-center pb-2 border-b border-[#f0e6d9]">
                <div>
                  <span className="text-[#8a6a50] uppercase font-black block">Sauce</span>
                  <span className="font-bold text-[#1a0a00] text-sm">
                    {selections.sauce ? selections.sauce.name : 'Not chosen yet'}
                  </span>
                </div>
                <span className="font-extrabold text-[#8a6a50]">
                  {selections.sauce && selections.sauce.priceModifier > 0
                    ? `+₦${selections.sauce.priceModifier}`
                    : '₦0'}
                </span>
              </div>

              {/* Cheese */}
              <div className="flex justify-between items-center pb-2 border-b border-[#f0e6d9]">
                <div>
                  <span className="text-[#8a6a50] uppercase font-black block">Cheese</span>
                  <span className="font-bold text-[#1a0a00] text-sm">
                    {selections.cheese ? selections.cheese.name : 'Not chosen yet'}
                  </span>
                </div>
                <span className="font-extrabold text-[#8a6a50]">
                  {selections.cheese && selections.cheese.priceModifier > 0
                    ? `+₦${selections.cheese.priceModifier}`
                    : '₦0'}
                </span>
              </div>

              {/* Vegetables */}
              <div className="pb-2 border-b border-[#f0e6d9]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#8a6a50] uppercase font-black block">
                    Vegetables ({selections.vegetables.length})
                  </span>
                  <span className="text-[#8a6a50] font-extrabold">
                    +₦
                    {selections.vegetables
                      .reduce((sum, v) => sum + v.priceModifier, 0)
                      .toLocaleString()}
                  </span>
                </div>
                {selections.vegetables.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selections.vegetables.map((v) => (
                      <span
                        key={v._id}
                        className="px-2 py-0.5 rounded bg-[#fff5f0] border border-[#f0e6d9] text-[11px] font-bold text-[#1a0a00]"
                      >
                        {v.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[#8a6a50]/70 italic">None selected yet (min 1)</span>
                )}
              </div>
            </div>

            {/* Total computation */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs text-[#8a6a50] mb-1">
                <span>Base Price</span>
                <span>₦{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-[#f0e6d9]">
                <span className="text-base font-black uppercase tracking-tight text-[#1a0a00]">
                  Total Pizza
                </span>
                <span className="text-2xl font-black text-[#ff4500]">
                  ₦{totalCalculated.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick action button in sidebar for Step 4 */}
            {currentStep === 4 && (
              <button
                type="button"
                disabled={selections.vegetables.length < 1}
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-lg shadow-[#ff4500]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Bag · ₦{totalCalculated.toLocaleString()}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Build;
