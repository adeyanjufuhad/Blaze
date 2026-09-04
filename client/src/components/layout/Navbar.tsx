import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, Menu as MenuIcon, X, Shield, Flame } from 'lucide-react';
import { Logo } from '../ui/Logo';
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
    <nav className="sticky top-0 z-40 w-full border-b border-[#f0e6d9] bg-white/95 backdrop-blur-md transition-all shadow-[0_2px_12px_rgba(240,230,217,0.4)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with dark text */}
        <Logo size="md" darkText={true} />

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/menu"
            className={`text-sm font-extrabold uppercase tracking-wider transition-colors hover:text-[#ff4500] ${
              isActive('/menu') ? 'text-[#ff4500]' : 'text-[#1a0a00]'
            }`}
          >
            Menu
          </Link>
          <Link
            to="/build"
            className={`flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wider transition-colors hover:text-[#ff4500] ${
              isActive('/build') ? 'text-[#ff4500]' : 'text-[#1a0a00]'
            }`}
          >
            <Flame className="w-4 h-4 text-[#ff4500]" />
            <span>Build Pizza</span>
          </Link>
          <Link
            to="/orders"
            className={`text-sm font-extrabold uppercase tracking-wider transition-colors hover:text-[#ff4500] ${
              isActive('/orders') ? 'text-[#ff4500]' : 'text-[#1a0a00]'
            }`}
          >
            Track Order
          </Link>
          {isAdminAuthenticated && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1 px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-xs font-black uppercase tracking-wider hover:bg-purple-100 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}
        </div>

        {/* Action Buttons: Cart & Auth */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* BAG Button: Orange-Red Outline */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex h-11 items-center gap-2 rounded-xl border-2 border-[#ff4500] bg-transparent hover:bg-[#fff5f0] px-3.5 sm:px-4 text-[#ff4500] transition-colors cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5 text-[#ff4500]" />
            <span className="hidden sm:inline text-xs font-black uppercase tracking-wider text-[#ff4500]">
              Bag
            </span>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4500] text-[11px] font-black text-white shadow-md shadow-[#ff4500]/40">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/orders"
                className="hidden sm:flex items-center gap-2 rounded-xl border border-[#f0e6d9] bg-[#fffaf5] px-3 py-2 text-xs font-bold text-[#1a0a00] hover:border-[#ff4500] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#ff4500]/15 text-[#ff4500] flex items-center justify-center font-black">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user?.name}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#f0e6d9] bg-[#fffaf5] text-[#8a6a50] hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              {/* LOG IN: Dark text */}
              <Link
                to="/auth/login"
                className="px-4 py-2.5 rounded-xl border border-[#f0e6d9] text-xs font-extrabold uppercase tracking-wider text-[#1a0a00] hover:bg-[#fffaf5] transition-colors"
              >
                Log In
              </Link>
              {/* SIGN UP: Orange-red fill */}
              <Link
                to="/auth/register"
                className="px-4 py-2.5 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#ff4500]/25 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-11 w-11 items-center justify-center rounded-xl border border-[#f0e6d9] bg-white text-[#1a0a00] hover:text-[#ff4500]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#f0e6d9] bg-white px-6 py-6 space-y-4">
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-black uppercase tracking-wider text-[#1a0a00] hover:text-[#ff4500]"
          >
            Our Menu
          </Link>
          <Link
            to="/build"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-black uppercase tracking-wider text-[#ff4500]"
          >
            Custom Pizza Builder
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-black uppercase tracking-wider text-[#1a0a00] hover:text-[#ff4500]"
          >
            Track Orders
          </Link>
          {isAdminAuthenticated && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-black uppercase tracking-wider text-purple-700"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-[#f0e6d9] flex gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-3 text-center rounded-xl border border-[#f0e6d9] text-xs font-black uppercase tracking-wider text-[#1a0a00]"
                >
                  Log In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-3 text-center rounded-xl bg-[#ff4500] text-xs font-black uppercase tracking-wider text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-3 text-center rounded-xl bg-[#fffaf5] border border-[#f0e6d9] text-xs font-black uppercase tracking-wider text-red-500"
              >
                Log Out ({user?.name})
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
