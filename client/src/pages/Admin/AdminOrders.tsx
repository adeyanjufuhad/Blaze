import React, { useEffect, useState } from 'react';
import { Search, Filter, RefreshCw, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import { Order, OrderStatus } from '../../types';
import { subscribeToAdminOrders } from '../../lib/socket';
import api from '../../lib/api';

const statusTabs = [
  { label: 'All Orders', value: 'all' },
  { label: 'Order Received', value: 'order_received' },
  { label: 'In Kitchen', value: 'in_kitchen' },
  { label: 'Sent to Delivery', value: 'sent_to_delivery' },
  { label: 'Delivered', value: 'delivered' },
];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/api/order', { params });
      if (res.data?.success) {
        setOrders(res.data.orders);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to live admin events via Socket.io
    const unsubscribe = subscribeToAdminOrders(
      (newOrder) => {
        toast.info(`🔔 New order received: #${newOrder._id.substring(newOrder._id.length - 6).toUpperCase()}`);
        setOrders((prev) => [newOrder, ...prev]);
      },
      (data) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === data.orderId ? { ...o, status: data.status } : o))
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedStatus, searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await api.put(`/api/order/${orderId}/status`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Order #${orderId.substring(orderId.length - 6)} updated to ${newStatus.replace('_', ' ')}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as OrderStatus } : o))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium tracking-widest text-[#2d5a27] uppercase">
            Kitchen Operations
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-[#111111] mt-1">
            Order Management
          </h1>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#e8e4dd] bg-white text-xs font-medium tracking-wide text-[#111111] hover:border-[#111111] shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedStatus(tab.value)}
                className={`px-3.5 py-2 rounded-full text-xs font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white border border-[#e8e4dd] text-[#666666] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#e8e4dd] focus:border-[#111111] rounded-full pl-10 pr-4 py-2 text-xs text-[#111111] placeholder-[#888888] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Full Orders Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-[#e8e4dd] bg-white shadow-xs">
        {loading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-[#666666] text-sm">
            No orders match the selected filters.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e8e4dd] bg-[#faf9f6] text-[11px] font-medium uppercase tracking-wider text-[#666666]">
                <th className="py-4 px-4">Order ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Address</th>
                <th className="py-4 px-4">Items Breakdown</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Time</th>
                <th className="py-4 px-4">Status Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e4dd]">
              {orders.map((order) => {
                const isUpdating = updatingId === order._id;

                return (
                  <tr key={order._id} className="hover:bg-[#faf9f6] transition-colors">
                    {/* ID */}
                    <td className="py-4 px-4 font-mono font-medium text-[#111111]">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <span className="font-medium text-[#111111] block">
                        {typeof order.user === 'object' ? order.user?.name : 'Customer'}
                      </span>
                      <span className="text-[10px] text-[#666666] block">
                        {typeof order.user === 'object' ? order.user?.email : ''}
                      </span>
                    </td>

                    {/* Address */}
                    <td className="py-4 px-4 text-[#666666] max-w-xs truncate">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4 text-[#666666]">
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="truncate max-w-xs">
                            <span className="font-medium text-[#111111]">{it.quantity}x</span>{' '}
                            {it.name || 'Custom Pizza'}
                            {it.customization && (
                              <span className="text-[10px] text-[#666666] ml-1">
                                ({it.customization.base}, {it.customization.cheese})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-4 font-semibold text-[#111111] text-sm">
                      ₦{order.totalAmount.toLocaleString()}
                    </td>

                    {/* Time */}
                    <td className="py-4 px-4 text-[#666666] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Live Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`bg-white border rounded-full px-3 py-1 text-xs font-medium transition-all focus:outline-none cursor-pointer ${
                          order.status === 'delivered'
                            ? 'border-[#2d5a27] text-[#2d5a27]'
                            : order.status === 'sent_to_delivery'
                            ? 'border-[#111111] text-[#111111]'
                            : order.status === 'in_kitchen'
                            ? 'border-amber-600 text-amber-700'
                            : 'border-neutral-400 text-[#111111]'
                        }`}
                      >
                        <option value="order_received">Order Received</option>
                        <option value="in_kitchen">In Kitchen</option>
                        <option value="sent_to_delivery">Sent to Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
