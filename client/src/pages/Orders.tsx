import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, ChevronUp, Package, Flame, MapPin, Calendar, CreditCard } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { OrderStatusPipeline } from '../components/ui/OrderStatusPipeline';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { toast } from '../components/ui/Toast';
import { subscribeToOrderStatus } from '../lib/socket';
import api from '../lib/api';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/order/my-orders');
        if (res.data?.orders) {
          setOrders(res.data.orders);
          // Auto expand the most recent active order
          if (res.data.orders.length > 0) {
            setExpandedOrders({ [res.data.orders[0]._id]: true });
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Subscribe to real-time status updates via Socket.io
    const unsubscribe = subscribeToOrderStatus((data) => {
      console.log('[Blaze Realtime] Received order:status_update:', data);
      setOrders((prev) =>
        prev.map((order) => {
          if (order._id === data.orderId) {
            toast.info(`Order #${order._id.substring(order._id.length - 6)} status updated to: ${data.status.replace('_', ' ').toUpperCase()}`);
            return {
              ...order,
              status: data.status as OrderStatus,
              updatedAt: data.updatedAt,
            };
          }
          return order;
        })
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-[#ff4500]">
          Live Kitchen Tracking
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#1a0a00] mt-1">
          Your Orders
        </h1>
        <p className="text-sm text-[#8a6a50] mt-1">
          Watch your pizzas bake and travel in real-time. Instant live websocket updates.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-36 rounded-2xl" />
          <Skeleton className="w-full h-36 rounded-2xl" />
          <Skeleton className="w-full h-36 rounded-2xl" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders placed yet"
          description="You haven't ordered any pizzas yet. Browse our chef creations or custom build your favorite pizza!"
          actionText="Explore Menu"
          actionLink="/menu"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = Boolean(expandedOrders[order._id]);
            const isDelivered = order.status === 'delivered';

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-[#f0e6d9] bg-white overflow-hidden shadow-blaze-card transition-all duration-200 hover:border-[#ff4500]"
              >
                {/* Order Summary Header */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-[#fffaf5] transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-[#8a6a50]">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="text-xs text-[#8a6a50] flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <span className="text-[11px] uppercase font-bold text-[#8a6a50] block">
                        Total Amount
                      </span>
                      <span className="text-lg font-black text-[#ff4500]">
                        ₦{order.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#fffaf5] border border-[#f0e6d9] flex items-center justify-center text-[#8a6a50]">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Real-time status pipeline for active or delivered order */}
                <div className="px-6 py-4 bg-[#fffaf5] border-t border-[#f0e6d9]">
                  <OrderStatusPipeline status={order.status} />
                </div>

                {/* Collapsible details breakdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#f0e6d9] px-6 py-5 bg-white space-y-5"
                    >
                      {/* Items */}
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#8a6a50] mb-3">
                          Items in this Order
                        </h4>
                        <div className="space-y-2.5">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-xl bg-[#fffaf5] border border-[#f0e6d9] text-xs"
                            >
                              <div>
                                <span className="font-black text-[#1a0a00] uppercase tracking-tight">
                                  {item.quantity}x {item.name || 'Artisanal Pizza'}
                                </span>
                                {item.customization && (
                                  <p className="text-[11px] text-[#8a6a50] mt-0.5">
                                    Base: {item.customization.base} · Sauce: {item.customization.sauce} · Cheese: {item.customization.cheese}
                                    {item.customization.vegetables?.length > 0 &&
                                      ` · Veg: ${item.customization.vegetables.join(', ')}`}
                                  </p>
                                )}
                              </div>
                              <span className="font-extrabold text-[#1a0a00] text-sm">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address & Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#f0e6d9] text-xs text-[#8a6a50]">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#ff4500] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#1a0a00] uppercase block">
                              Delivery Destination
                            </span>
                            <span>{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}</span>
                            {order.deliveryAddress.phone && (
                              <div className="text-[#8a6a50] mt-0.5">Rider contact: {order.deliveryAddress.phone}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#1a0a00] uppercase block">
                              Payment Verification
                            </span>
                            <span className="text-emerald-600 font-bold">Paid via Razorpay</span>
                            <div className="text-[#8a6a50] font-mono text-[10px] truncate mt-0.5">
                              Payment ID: {order.razorpayPaymentId || 'pay_verified'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
