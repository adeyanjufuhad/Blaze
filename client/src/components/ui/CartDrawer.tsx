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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel Sliding from Right */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-white border-l border-[#f0e6d9] text-[#1a0a00] flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Your cart"
            >
              {/* Header */}
              <header className="flex items-center justify-between px-6 py-5 border-b border-[#f0e6d9] bg-[#fffaf5]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff4500]/15 text-[#ff4500]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-[#1a0a00]">
                      Your Bag
                    </h3>
                    <span className="text-[11px] font-bold text-[#8a6a50]">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-lg p-2 text-[#8a6a50] hover:text-[#1a0a00] hover:bg-[#f0e6d9]/40 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              {/* Items List or Empty State */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-[#fffaf5] border border-[#f0e6d9] flex items-center justify-center text-[#ff4500] mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-black text-[#1a0a00] uppercase tracking-tight">
                      Your bag is empty.
                    </p>
                    <span className="text-sm text-[#8a6a50] mt-1 mb-6">
                      Add something blazing hot from the menu.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        closeDrawer();
                        navigate('/menu');
                      }}
                      className="px-6 py-3 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-extrabold uppercase text-xs tracking-wider transition-all duration-200 shadow-md shadow-[#ff4500]/25"
                    >
                      Browse the menu
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3.5 rounded-xl border border-[#f0e6d9] bg-[#fffaf5] transition-colors hover:border-[#ff4500]/40 shadow-sm"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white border border-[#f0e6d9]">
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
                            <h4 className="font-black text-sm uppercase tracking-tight text-[#1a0a00] line-clamp-1">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-[#8a6a50] hover:text-red-500 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Customization Details if any */}
                          {item.isCustom && item.customization && (
                            <p className="text-[11px] text-[#8a6a50] line-clamp-1 mt-0.5">
                              {item.customization.base} · {item.customization.sauce} ·{' '}
                              {item.customization.cheese}
                            </p>
                          )}
                        </div>

                        {/* Price & Stepper */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-black text-[#1a0a00]">
                            <span className="text-[#ff4500]">₦</span>
                            {(item.price * item.quantity).toLocaleString()}
                          </span>

                          <div className="flex items-center gap-2 rounded-lg bg-white border border-[#f0e6d9] px-2 py-1 shadow-xs">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              className="text-[#8a6a50] hover:text-[#1a0a00] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-[#1a0a00]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              className="text-[#8a6a50] hover:text-[#1a0a00] transition-colors"
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
                <footer className="border-t border-[#f0e6d9] bg-[#fffaf5] p-6 space-y-4">
                  <div className="space-y-1.5 text-xs text-[#8a6a50]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#1a0a00] font-bold">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee (Flat)</span>
                      <span className="text-[#1a0a00] font-bold">₦{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-[#1a0a00] pt-2 border-t border-[#f0e6d9]">
                      <span>Total</span>
                      <span className="text-[#ff4500]">₦{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleGoToCart}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-extrabold uppercase text-xs tracking-wider transition-all duration-200 shadow-lg shadow-[#ff4500]/25 active:scale-95 cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="w-full py-2.5 rounded-xl text-[#8a6a50] hover:text-[#1a0a00] font-bold uppercase text-[11px] tracking-wider transition-colors text-center"
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
