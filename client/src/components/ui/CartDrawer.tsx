import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQty,
    getSubtotal,
    deliveryFee,
    getTotal,
  } = useCartStore();

  const navigate = useNavigate();
  const subtotal = getSubtotal();
  const total = getTotal();

  const handleGoToCart = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel Sliding from Right */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-[#faf9f6] border-l border-[#e8e4dd] text-[#111111] flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Your cart"
            >
              {/* Header */}
              <header className="flex items-center justify-between px-6 py-5 border-b border-[#e8e4dd] bg-[#faf9f6]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111111] text-white">
                    <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#111111] font-normal tracking-tight">
                      Your Bag
                    </h3>
                    <span className="text-xs text-[#666666]">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-full p-2 text-[#666666] hover:text-[#111111] hover:bg-[#e8e4dd]/50 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              {/* Items List or Empty State */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#faf9f6]">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-white border border-[#e8e4dd] flex items-center justify-center text-[#666666] mb-4">
                      <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <p className="font-serif text-xl text-[#111111] font-normal">
                      Your bag is empty
                    </p>
                    <span className="text-xs text-[#666666] mt-1 mb-6">
                      Explore our wood-fired pizzas and chef specials.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        closeDrawer();
                        navigate('/menu');
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white text-xs font-medium tracking-wide transition-colors"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3.5 rounded-xl border border-[#e8e4dd] bg-white transition-colors hover:border-[#111111]/30 shadow-xs"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#faf9f6]">
                        <img
                          src={
                            item.image ||
                            'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80'
                          }
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-sm text-[#111111] font-normal line-clamp-1">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-[#999999] hover:text-red-500 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Customization Details if any */}
                          {item.isCustom && item.customization && (
                            <p className="text-[11px] text-[#666666] line-clamp-1 mt-0.5">
                              {item.customization.base} · {item.customization.sauce} ·{' '}
                              {item.customization.cheese}
                            </p>
                          )}
                        </div>

                        {/* Price & Stepper */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-medium text-[#111111]">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>

                          <div className="flex items-center gap-2 rounded-full bg-[#faf9f6] border border-[#e8e4dd] px-2 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              className="text-[#666666] hover:text-[#111111] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-medium w-4 text-center text-[#111111]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              className="text-[#666666] hover:text-[#111111] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <footer className="border-t border-[#e8e4dd] bg-white p-6 space-y-4">
                  <div className="space-y-1.5 text-xs text-[#666666]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#111111] font-medium">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="text-[#111111] font-medium">₦{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-[#111111] pt-2 border-t border-[#e8e4dd]">
                      <span>Total</span>
                      <span className="text-[#111111]">₦{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleGoToCart}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="w-full py-2 text-[#666666] hover:text-[#111111] text-xs transition-colors text-center"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </footer>
              )}
            </motion.aside>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
