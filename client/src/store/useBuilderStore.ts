import { create } from 'zustand';
import { CustomizationOption, CustomizationSelection } from '../types';

interface BuilderState {
  currentStep: number;
  basePrice: number; // Standard custom pizza baseline price, e.g., ₦4,500
  selections: CustomizationSelection;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectBase: (option: CustomizationOption) => void;
  selectSauce: (option: CustomizationOption) => void;
  selectCheese: (option: CustomizationOption) => void;
  toggleVegetable: (option: CustomizationOption) => { success: boolean; message?: string };
  calculateTotal: () => number;
  resetBuilder: () => void;
  canProceedToNextStep: () => boolean;
}

const initialSelections: CustomizationSelection = {
  base: null,
  sauce: null,
  cheese: null,
  vegetables: [],
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  currentStep: 1,
  basePrice: 4500, // ₦4,500 base pizza price
  selections: initialSelections,

  setStep: (step: number) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, canProceedToNextStep } = get();
    if (canProceedToNextStep() && currentStep < 4) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  selectBase: (option) => {
    set((state) => ({
      selections: { ...state.selections, base: option },
    }));
  },

  selectSauce: (option) => {
    set((state) => ({
      selections: { ...state.selections, sauce: option },
    }));
  },

  selectCheese: (option) => {
    set((state) => ({
      selections: { ...state.selections, cheese: option },
    }));
  },

  toggleVegetable: (option) => {
    const { selections } = get();
    const exists = selections.vegetables.some((v) => v._id === option._id || v.name === option.name);

    if (exists) {
      const updated = selections.vegetables.filter(
        (v) => v._id !== option._id && v.name !== option.name
      );
      set({
        selections: { ...selections, vegetables: updated },
      });
      return { success: true };
    } else {
      if (selections.vegetables.length >= 6) {
        return { success: false, message: 'You can select a maximum of 6 vegetables' };
      }
      set({
        selections: {
          ...selections,
          vegetables: [...selections.vegetables, option],
        },
      });
      return { success: true };
    }
  },

  calculateTotal: () => {
    const { basePrice, selections } = get();
    let total = basePrice;

    if (selections.base) total += selections.base.priceModifier;
    if (selections.sauce) total += selections.sauce.priceModifier;
    if (selections.cheese) total += selections.cheese.priceModifier;
    selections.vegetables.forEach((v) => {
      total += v.priceModifier;
    });

    return total;
  },

  canProceedToNextStep: () => {
    const { currentStep, selections } = get();
    switch (currentStep) {
      case 1:
        return selections.base !== null;
      case 2:
        return selections.sauce !== null;
      case 3:
        return selections.cheese !== null;
      case 4:
        return selections.vegetables.length >= 1; // Min 1 vegetable required
      default:
        return false;
    }
  },

  resetBuilder: () => {
    set({
      currentStep: 1,
      selections: {
        base: null,
        sauce: null,
        cheese: null,
        vegetables: [],
      },
    });
  },
}));
