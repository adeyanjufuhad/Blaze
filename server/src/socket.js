let io = null;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Blaze Socket] Client connected: ${socket.id}`);

    // Client sends their userId to join their personal updates room
    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`[Blaze Socket] Socket ${socket.id} joined room for user: ${userId}`);
      }
    });

    // Admin room for new orders broadcast
    socket.on('join:admin', () => {
      socket.join('admin_room');
      console.log(`[Blaze Socket] Socket ${socket.id} joined admin room`);
    });

    socket.on('disconnect', () => {
      console.log(`[Blaze Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

const emitOrderStatusUpdate = (userId, data) => {
  if (!io) {
    console.warn('[Blaze Socket] IO not initialized, cannot emit order:status_update');
    return;
  }
  console.log(`[Blaze Socket] Emitting order:status_update to user room ${userId}:`, data);
  io.to(userId.toString()).emit('order:status_update', data);
  // Also notify admins
  io.to('admin_room').emit('admin:order_updated', data);
};

const emitNewOrderToAdmin = (order) => {
  if (!io) return;
  io.to('admin_room').emit('admin:new_order', order);
};

module.exports = {
  initSocket,
  getIO,
  emitOrderStatusUpdate,
  emitNewOrderToAdmin,
};
