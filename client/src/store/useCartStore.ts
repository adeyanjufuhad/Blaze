import { create } from 'zustand';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  deliveryFee: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => {
  // Load saved cart
  const stored = localStorage.getItem('blaze_cart');
  let initialItems: CartItem[] = [];
  try {
    if (stored) initialItems = JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse cart', e);
  }

  const saveItems = (items: CartItem[]) => {
    localStorage.setItem('blaze_cart', JSON.stringify(items));
  };

  return {
    items: initialItems,
    isDrawerOpen: false,
    deliveryFee: 500, // ₦500 flat delivery fee

    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),

    addItem: (newItem) => {
      set((state) => {
        // Check if an identical item is already in the cart
        const existingIndex = state.items.findIndex((item) => {
          if (item.pizzaId && newItem.pizzaId) {
            return item.pizzaId === newItem.pizzaId;
          }
          if (item.isCustom && newItem.isCustom) {
            return JSON.stringify(item.customization) === JSON.stringify(newItem.customization);
          }
          return false;
        });

        let updatedItems: CartItem[];

        if (existingIndex > -1) {
          updatedItems = [...state.items];
          updatedItems[existingIndex].quantity += newItem.quantity || 1;
        } else {
          const itemWithId: CartItem = {
            ...newItem,
            id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            quantity: newItem.quantity || 1,
          };
          updatedItems = [...state.items, itemWithId];
        }

        saveItems(updatedItems);
        // Automatically slide open the cart drawer on adding an item
        return { items: updatedItems, isDrawerOpen: true };
      });
    },

    removeItem: (id) => {
      set((state) => {
        const updated = state.items.filter((item) => item.id !== id);
        saveItems(updated);
        return { items: updated };
      });
    },

    updateQty: (id, delta) => {
      set((state) => {
        const updated = state.items
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        saveItems(updated);
        return { items: updated };
      });
    },

    clearCart: () => {
      localStorage.removeItem('blaze_cart');
      set({ items: [] });
    },

    getSubtotal: () => {
      return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    getTotal: () => {
      const sub = get().getSubtotal();
      if (sub === 0) return 0;
      return sub + get().deliveryFee;
    },

    getItemCount: () => {
      return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },
  };
});
