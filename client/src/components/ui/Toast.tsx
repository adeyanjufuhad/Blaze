import React from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4500);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export const toast = {
  success: (msg: string) => useToastStore.getState().addToast(msg, 'success'),
  error: (msg: string) => useToastStore.getState().addToast(msg, 'error'),
  info: (msg: string) => useToastStore.getState().addToast(msg, 'info'),
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const getStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-[#2d5a27] flex-shrink-0" />,
          border: 'border-[#e8e4dd] bg-white text-[#111111]',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />,
          border: 'border-red-200 bg-white text-red-700',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-4 h-4 text-[#111111] flex-shrink-0" />,
          border: 'border-[#e8e4dd] bg-white text-[#111111]',
        };
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((item) => {
          const { icon, border } = getStyle(item.type);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-lg ${border}`}
            >
              <div className="flex items-center gap-3">
                {icon}
                <span className="text-xs font-medium leading-snug">{item.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="text-[#888888] hover:text-[#111111] p-1 transition-colors cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
