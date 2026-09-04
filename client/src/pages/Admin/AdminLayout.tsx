import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Boxes, Utensils, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout, adminUser } = useAuthStore();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Orders & Pipeline', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Live Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Menu Catalog', path: '/admin/menu', icon: Utensils },
  ];

  return (
    <div className="min-h-screen bg-[#f9f5f0] text-[#1a0a00] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1a0a00] border-r border-[#2d1808] flex-shrink-0 flex flex-col justify-between p-6 text-white">
        <div className="space-y-8">
          <div>
            <Logo size="sm" isLink={false} />
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800 text-[10px] font-black uppercase tracking-widest text-purple-300">
              <Shield className="w-3 h-3" />
              <span>Admin Portal</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-[#ff4500] text-white shadow-lg shadow-[#ff4500]/25'
                      : 'text-stone-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="text-xs text-neutral-400">
            <span className="block text-[10px] uppercase font-bold text-stone-500">Logged in as</span>
            <span className="font-bold text-white truncate block">{adminUser?.name || 'Administrator'}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/80 text-stone-300 hover:text-red-400 text-xs font-black uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>

          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-1 text-[11px] font-bold text-stone-400 hover:text-white uppercase transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Customer Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl bg-[#f9f5f0] text-[#1a0a00]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
