import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, Menu as MenuIcon, X, Shield, User } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Magnetic } from '../ui/Magnetic';
import { TextScramble } from '../ui/TextScramble';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { getItemCount, openDrawer } = useCartStore();
  const { isAuthenticated, user, logout, isAdminAuthenticated } = useAuthStore();
  const cartCount = getItemCount();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar / Ticker */}
      <div className="w-full bg-[#faf9f6] border-b border-[#e8e4dd] py-1.5 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-[11px] font-medium tracking-wide text-[#666666]">
          <span>🔥 Freshly baked wood-fired crusts</span>
          <span className="opacity-40">·</span>
          <span>Free campus delivery on orders over ₦8,000</span>
          <span className="opacity-40">·</span>
          <span className="hidden sm:inline">Open late till 2 AM</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="w-full border-b border-[#e8e4dd] bg-[#faf9f6]/95 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" darkText={true} />
          </div>

          {/* Center Navigation Links: clean, spaced: MENU · BUILD PIZZA · TRACK ORDER */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-[0.02em] text-[#111111]">
            <Link
              to="/menu"
              className={`transition-opacity hover:opacity-60 ${
                isActive('/menu') ? 'font-semibold border-b border-[#111111] pb-0.5' : ''
              }`}
            >
              <TextScramble text="MENU" />
            </Link>
            <Link
              to="/build"
              className={`transition-opacity hover:opacity-60 ${
                isActive('/build') ? 'font-semibold border-b border-[#111111] pb-0.5' : ''
              }`}
            >
              <TextScramble text="BUILD PIZZA" />
            </Link>
            <Link
              to="/orders"
              className={`transition-opacity hover:opacity-60 ${
                isActive('/orders') ? 'font-semibold border-b border-[#111111] pb-0.5' : ''
              }`}
            >
              <TextScramble text="TRACK ORDER" />
            </Link>
            {isAdminAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#111111]/20 text-[#111111] text-[11px] font-medium hover:bg-[#111111] hover:text-white transition-colors"
              >
                <Shield className="w-3 h-3" />
                <span>ADMIN</span>
              </Link>
            )}
          </div>

          {/* Right: Order Now pill button + Bag + Auth */}
          <div className="flex items-center gap-3">
            {/* Order Now Button: #111111 background, white text, rounded-full, px-5 py-2, text-xs font-medium */}
            <Magnetic strength={0.35}>
              <Link
                to="/menu"
                className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-2 text-xs font-medium text-[#faf9f6] hover:bg-[#2d5a27] transition-colors shadow-xs"
              >
                <TextScramble text="Order Now" />
              </Link>
            </Magnetic>

            {/* Cart Bag Icon: simple outline bag with badge */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative p-2 text-[#111111] hover:opacity-70 transition-opacity cursor-pointer rounded-full border border-transparent hover:border-[#e8e4dd]"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#111111] text-[10px] font-medium text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Auth state */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/orders"
                  className="hidden sm:flex items-center gap-1.5 text-xs text-[#111111] hover:opacity-70 font-medium px-2 py-1 rounded-full border border-[#e8e4dd]"
                  title="My Account"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[80px] truncate">{user?.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-[#666666] hover:text-[#111111] transition-colors"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="text-xs font-medium text-[#111111] hover:opacity-60 transition-opacity px-2 py-1"
                >
                  Log In
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#111111] hover:opacity-70"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#e8e4dd] bg-[#faf9f6] px-6 py-6 space-y-4">
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium tracking-wide text-[#111111]"
            >
              MENU
            </Link>
            <Link
              to="/build"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium tracking-wide text-[#111111]"
            >
              BUILD PIZZA
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium tracking-wide text-[#111111]"
            >
              TRACK ORDER
            </Link>
            {isAdminAuthenticated && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-[#111111]"
              >
                ADMIN DASHBOARD
              </Link>
            )}

            <div className="pt-4 border-t border-[#e8e4dd] flex flex-col gap-3">
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-full bg-[#111111] text-xs font-medium text-[#faf9f6]"
              >
                Order Now
              </Link>
              {!isAuthenticated ? (
                <div className="flex gap-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-full border border-[#e8e4dd] text-xs font-medium text-[#111111]"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-full bg-[#2d5a27] text-xs font-medium text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2 text-center rounded-full border border-[#e8e4dd] text-xs font-medium text-[#666666]"
                >
                  Log Out ({user?.name})
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
