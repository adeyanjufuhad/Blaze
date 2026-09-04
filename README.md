# Blaze Pizza

Full-stack pizza ordering platform with custom pizza builder, real-time order tracking, and admin inventory management.

**Live:** [https://blaze-pizza.vercel.app](https://blaze-pizza.vercel.app)  
**Stack:** React · Node.js · Express · MongoDB · Socket.io · Razorpay · Nodemailer

---

## Features
- **JWT Auth**: Access & refresh tokens, email verification, and password reset
- **Custom Pizza Builder**: 4-step flow (Crust Base → Sauce → Cheese → Vegetables) with real-time price computation
- **Oriente-Inspired Dark Design**: `#0f0f0f` near-black canvas, fiery `#ff4500` accents, oversized bold typography, kinetic marquees, and sliding cart drawer
- **Razorpay Integration**: Test card processing with HMAC verification and sandbox simulation
- **Real-Time Order Tracking**: Socket.io live status pipeline (`Order Received` → `In Kitchen` → `Sent to Delivery` → `Delivered`)
- **Admin Portal**: Live order management, inline inventory stock & threshold editing, and pizza menu catalog manager
- **Automated Stock Alerts**: Daily 8:00 AM `node-cron` low-stock inventory check with consolidated Nodemailer alerts
- **Cloudinary Image Uploads**: Cloud image storage with zero-config buffer fallback

---

## Run locally

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- (Optional) MongoDB instance or Atlas URI (an embedded in-memory database will run automatically if no URI is supplied)

### 2. Quick Monorepo Start
```bash
# Install root dependencies
npm install

# Install server & client dependencies
npm run install:all

# Seed database with signature pizzas, builder toppings, inventory, and admin
npm run seed

# Run both backend and frontend concurrently
npm run dev
```

### 3. Or Run Individually
```bash
# Backend (Port 5000)
cd server
npm install
npm run dev

# Frontend (Port 5173)
cd client
npm install
npm run dev
```

---

## Test credentials
- **Admin Account**: `admin@blaze.com` / `Admin@blaze123`
- **Customer Account**: `alex@blaze.com` / `User@blaze123`
- **Razorpay Test Card**: `4111 1111 1111 1111` (any future expiry, any 3-digit CVV)

---

## Deployment Guide

### Backend → Render (Free Tier Web Service)
1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect this repository and set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add Environment Variables in Render Dashboard:
   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blaze`
   - `JWT_SECRET=your_jwt_secret`
   - `JWT_REFRESH_SECRET=your_jwt_refresh_secret`
   - `RAZORPAY_KEY_ID=your_razorpay_key_id`
   - `RAZORPAY_KEY_SECRET=your_razorpay_key_secret`
   - `GMAIL_USER=your_gmail@gmail.com`
   - `GMAIL_APP_PASSWORD=your_gmail_app_password`
   - `ADMIN_EMAIL=admin@blaze.com`
   - `CLIENT_URL=https://your-blaze-client.vercel.app`
4. Deploy service and copy your Render backend URL (e.g. `https://blaze-server.onrender.com`).

### Frontend → Vercel
1. In Vercel, click **Add New Project** and select this repository.
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set Environment Variables:
   - `VITE_API_URL=https://blaze-server.onrender.com`
   - `VITE_SOCKET_URL=https://blaze-server.onrender.com`
   - `VITE_RAZORPAY_KEY_ID=your_razorpay_key_id`
4. Click **Deploy**.
