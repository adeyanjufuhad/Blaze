import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('[Blaze Socket] Connected to real-time engine with ID:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Blaze Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.warn('[Blaze Socket] Connection error:', error.message);
    });
  }

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const joinUserRoom = (userId: string) => {
  const s = getSocket();
  if (s && userId) {
    s.emit('join', userId);
    console.log(`[Blaze Socket] Sent join room request for user: ${userId}`);
  }
};

export const joinAdminRoom = () => {
  const s = getSocket();
  if (s) {
    s.emit('join:admin');
    console.log('[Blaze Socket] Sent join request for admin room');
  }
};

export const subscribeToOrderStatus = (
  callback: (data: { orderId: string; status: string; updatedAt: string }) => void
) => {
  const s = getSocket();
  s.on('order:status_update', callback);

  return () => {
    s.off('order:status_update', callback);
  };
};

export const subscribeToAdminOrders = (
  onNewOrder: (order: any) => void,
  onStatusUpdate: (data: any) => void
) => {
  const s = getSocket();
  s.on('admin:new_order', onNewOrder);
  s.on('admin:order_updated', onStatusUpdate);

  return () => {
    s.off('admin:new_order', onNewOrder);
    s.off('admin:order_updated', onStatusUpdate);
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
