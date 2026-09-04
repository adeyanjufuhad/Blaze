const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { initSocket } = require('./socket');
const { initCronJobs } = require('./cron/stockAlertJob');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const customizationRoutes = require('./routes/customizationRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Blaze Pizza Platform',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/pizza', pizzaRoutes);
app.use('/api/customization', customizationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    initCronJobs();

    server.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🔥 Blaze Platform Server active on port ${PORT}`);
      console.log(`📡 Socket.io connected and accepting events`);
      console.log(`🌐 Client origin allowed: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start Blaze server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
