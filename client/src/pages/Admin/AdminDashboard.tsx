import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, AlertTriangle, Utensils, ArrowUpRight, Clock, CheckCircle, Package } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
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
          <span className="text-xs font-black uppercase tracking-widest text-[#ff4500]">
            System Overview
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#1a0a00] mt-1">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-white border border-[#f0e6d9] hover:border-[#ff4500] hover:text-[#ff4500] text-xs font-black uppercase tracking-wider text-[#1a0a00] shadow-sm transition-colors"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/inventory"
            className="px-4 py-2.5 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#ff4500]/25 transition-all"
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
          <div className="p-5 rounded-2xl border border-[#f0e6d9] bg-white shadow-blaze-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#8a6a50] block">
                Total Orders Today
              </span>
              <span className="text-3xl font-black text-[#1a0a00] mt-1 block">
                {stats?.totalOrdersToday ?? 0}
              </span>
              <span className="text-[10px] text-[#8a6a50] font-bold">
                Lifetime: {stats?.totalOrdersCount ?? 0}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Revenue Today */}
          <div className="p-5 rounded-2xl border border-[#f0e6d9] bg-white shadow-blaze-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#8a6a50] block">
                Revenue Today
              </span>
              <span className="text-3xl font-black text-[#ff4500] mt-1 block">
                ₦{(stats?.revenueToday ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-[#8a6a50] font-bold">
                Total: ₦{(stats?.totalRevenue ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#ff4500]/10 border border-[#ff4500]/20 flex items-center justify-center text-[#ff4500]">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Active Orders */}
          <div className="p-5 rounded-2xl border border-[#f0e6d9] bg-white shadow-blaze-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#8a6a50] block">
                Active Orders
              </span>
              <span className="text-3xl font-black text-amber-600 mt-1 block">
                {stats?.activeOrders ?? 0}
              </span>
              <span className="text-[10px] text-[#8a6a50] font-bold">
                In kitchen or delivery
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Utensils className="w-6 h-6" />
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="p-5 rounded-2xl border border-[#f0e6d9] bg-white shadow-blaze-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#8a6a50] block">
                Low Stock Alerts
              </span>
              <span
                className={`text-3xl font-black mt-1 block ${
                  (stats?.lowStockCount ?? 0) > 0 ? 'text-red-500' : 'text-emerald-600'
                }`}
              >
                {stats?.lowStockCount ?? 0}
              </span>
              <span className="text-[10px] text-[#8a6a50] font-bold">
                Below threshold
              </span>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                (stats?.lowStockCount ?? 0) > 0
                  ? 'bg-red-500/10 border-red-500/20 text-red-500'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
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
              <h3 className="text-base font-black uppercase tracking-tight">
                Attention Required: Low Inventory ({lowStockAlerts.length})
              </h3>
            </div>
            <Link
              to="/admin/inventory?lowOnly=true"
              className="text-xs font-black uppercase text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Restock in Inventory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {lowStockAlerts.map((item) => (
              <div
                key={item._id}
                className="p-3 rounded-xl bg-white border border-red-100 shadow-sm space-y-1"
              >
                <div className="text-xs font-black text-[#1a0a00] uppercase truncate">
                  {item.name}
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-red-500 font-bold">
                    {item.stock} {item.unit}
                  </span>
                  <span className="text-[10px] text-[#8a6a50]">
                    Min: {item.threshold}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table (Last 10) */}
      <div className="rounded-2xl border border-[#f0e6d9] bg-white p-6 space-y-4 shadow-blaze-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0e6d9]">
          <div>
            <h3 className="font-black text-lg uppercase tracking-tight text-[#1a0a00]">
              Recent Orders
            </h3>
            <p className="text-xs text-[#8a6a50]">
              Last 10 customer orders with real-time status.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs font-black uppercase tracking-wider text-[#ff4500] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-[#8a6a50] text-sm">
            No orders found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f0e6d9] text-[#8a6a50] uppercase font-black tracking-wider">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e6d9]">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#fffaf5] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#1a0a00]">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#1a0a00] block">
                        {typeof order.user === 'object' ? order.user?.name : 'Customer'}
                      </span>
                      <span className="text-[10px] text-[#8a6a50] block">
                        {typeof order.user === 'object' ? order.user?.email : ''}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#8a6a50]">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} pizzas
                    </td>
                    <td className="py-3 px-3 font-black text-[#1a0a00]">
                      ₦{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-3 text-[#8a6a50]">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="px-2.5 py-1 rounded-lg bg-[#fffaf5] border border-[#f0e6d9] hover:border-[#ff4500] text-[#1a0a00] font-bold text-[11px] transition-colors"
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
