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
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-medium tracking-widest text-[#666666] uppercase">
          Live Kitchen Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#111111] mt-1">
          Your Orders
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] mt-1">
          Follow your pizzas as they bake and travel in real-time.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-32 rounded-2xl" />
          <Skeleton className="w-full h-32 rounded-2xl" />
          <Skeleton className="w-full h-32 rounded-2xl" />
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
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = Boolean(expandedOrders[order._id]);

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-[#e8e4dd] bg-white overflow-hidden transition-all duration-200 hover:border-[#111111]/30"
              >
                {/* Order Summary Header */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-[#faf9f6] transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#888888]">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="text-xs text-[#888888] flex items-center gap-2">
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
                      <span className="text-[10px] uppercase tracking-wider text-[#888888] block">
                        Total Amount
                      </span>
                      <span className="text-base font-medium text-[#111111]">
                        ₦{order.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-[#faf9f6] border border-[#e8e4dd] flex items-center justify-center text-[#666666]">
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Real-time status pipeline for active or delivered order */}
                <div className="px-6 py-4 bg-[#faf9f6] border-t border-[#e8e4dd]">
                  <OrderStatusPipeline status={order.status} />
                </div>

                {/* Collapsible details breakdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#e8e4dd] px-6 py-5 bg-white space-y-5"
                    >
                      {/* Items */}
                      <div>
                        <h4 className="text-xs font-medium tracking-wide text-[#888888] uppercase mb-3">
                          Items in this Order
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-xl bg-[#faf9f6] border border-[#e8e4dd] text-xs"
                            >
                              <div>
                                <span className="font-serif text-[#111111] text-sm">
                                  {item.quantity}x {item.name || 'Artisanal Pizza'}
                                </span>
                                {item.customization && (
                                  <p className="text-[11px] text-[#666666] mt-0.5">
                                    Base: {item.customization.base} · Sauce: {item.customization.sauce} · Cheese: {item.customization.cheese}
                                    {item.customization.vegetables?.length > 0 &&
                                      ` · Veg: ${item.customization.vegetables.join(', ')}`}
                                  </p>
                                )}
                              </div>
                              <span className="font-medium text-[#111111] text-xs">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address & Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#e8e4dd] text-xs text-[#666666]">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#111111] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-[#111111] block">
                              Delivery Destination
                            </span>
                            <span>{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}</span>
                            {order.deliveryAddress.phone && (
                              <div className="text-[#888888] mt-0.5">Contact: {order.deliveryAddress.phone}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <CreditCard className="w-4 h-4 text-[#2d5a27] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-[#111111] block">
                              Payment Verification
                            </span>
                            <span className="text-[#2d5a27] font-medium">Paid via Razorpay</span>
                            <div className="text-[#888888] font-mono text-[10px] truncate mt-0.5">
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
