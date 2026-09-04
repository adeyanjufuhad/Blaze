import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, AlertTriangle, Utensils, ArrowUpRight, Clock, CheckCircle, Package } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { toast } from '../../components/ui/Toast';
import { Order, InventoryItem } from '../../types';
import api from '../../lib/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/dashboard');
      if (res.data?.success) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
        setLowStockAlerts(res.data.lowStockAlerts || []);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium tracking-widest text-[#2d5a27] uppercase">
            System Overview
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-[#111111] mt-1">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-full bg-white border border-[#e8e4dd] hover:border-[#111111] text-xs font-medium tracking-wide text-[#111111] shadow-xs transition-colors"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/inventory"
            className="px-4 py-2.5 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-xs font-medium tracking-wide text-white transition-all"
          >
            Inventory Stock
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Orders Today */}
          <div className="p-5 rounded-2xl border border-[#e8e4dd] bg-white shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block">
                Total Orders Today
              </span>
              <span className="text-3xl font-semibold text-[#111111] mt-1 block font-serif">
                <AnimatedCounter value={stats?.totalOrdersToday ?? 0} />
              </span>
              <span className="text-[10px] text-[#666666]">
                Lifetime: <AnimatedCounter value={stats?.totalOrdersCount ?? 0} duration={1.2} />
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#111111]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          {/* Revenue Today */}
          <div className="p-5 rounded-2xl border border-[#e8e4dd] bg-white shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block">
                Revenue Today
              </span>
              <span className="text-3xl font-semibold text-[#111111] mt-1 block font-serif">
                <AnimatedCounter value={stats?.revenueToday ?? 0} prefix="₦" />
              </span>
              <span className="text-[10px] text-[#666666]">
                Total: <AnimatedCounter value={stats?.totalRevenue ?? 0} prefix="₦" duration={1.2} />
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#2d5a27]/10 border border-[#2d5a27]/20 flex items-center justify-center text-[#2d5a27]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Active Orders */}
          <div className="p-5 rounded-2xl border border-[#e8e4dd] bg-white shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block">
                Active Orders
              </span>
              <span className="text-3xl font-semibold text-amber-700 mt-1 block font-serif">
                <AnimatedCounter value={stats?.activeOrders ?? 0} />
              </span>
              <span className="text-[10px] text-[#666666]">
                In kitchen or delivery
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <Utensils className="w-5 h-5" />
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="p-5 rounded-2xl border border-[#e8e4dd] bg-white shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block">
                Low Stock Alerts
              </span>
              <span
                className={`text-3xl font-semibold mt-1 block font-serif ${
                  (stats?.lowStockCount ?? 0) > 0 ? 'text-red-500' : 'text-[#2d5a27]'
                }`}
              >
                <AnimatedCounter value={stats?.lowStockCount ?? 0} />
              </span>
              <span className="text-[10px] text-[#666666]">
                Below threshold
              </span>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                (stats?.lowStockCount ?? 0) > 0
                  ? 'bg-red-500/10 border-red-500/20 text-red-500'
                  : 'bg-[#2d5a27]/10 border-[#2d5a27]/20 text-[#2d5a27]'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Grid: Low Stock Alert Cards + Quick Links */}
      {lowStockAlerts.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif text-base font-normal tracking-tight">
                Attention Required: Low Inventory ({lowStockAlerts.length})
              </h3>
            </div>
            <Link
              to="/admin/inventory?lowOnly=true"
              className="text-xs font-medium text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Restock in Inventory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {lowStockAlerts.map((item) => (
              <div
                key={item._id}
                className="p-3 rounded-xl bg-white border border-red-100 shadow-xs space-y-1"
              >
                <div className="text-xs font-semibold text-[#111111] truncate">
                  {item.name}
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-red-500 font-semibold">
                    {item.stock} {item.unit}
                  </span>
                  <span className="text-[10px] text-[#666666]">
                    Min: {item.threshold}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table (Last 10) */}
      <div className="rounded-2xl border border-[#e8e4dd] bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e4dd]">
          <div>
            <h3 className="font-serif text-lg font-normal tracking-tight text-[#111111]">
              Recent Orders
            </h3>
            <p className="text-xs text-[#666666]">
              Last 10 customer orders with real-time status.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs font-medium text-[#111111] hover:text-[#2d5a27] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-[#666666] text-sm">
            No orders found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e8e4dd] text-[#666666] uppercase font-medium tracking-wider">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e4dd]">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#faf9f6] transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-[#111111]">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-[#111111] block">
                        {typeof order.user === 'object' ? order.user?.name : 'Customer'}
                      </span>
                      <span className="text-[10px] text-[#666666] block">
                        {typeof order.user === 'object' ? order.user?.email : ''}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#666666]">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} pizzas
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#111111]">
                      ₦{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-3 text-[#666666]">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="px-3 py-1 rounded-full bg-[#faf9f6] border border-[#e8e4dd] hover:border-[#111111] text-[#111111] font-medium text-[11px] transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
