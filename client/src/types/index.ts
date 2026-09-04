export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isVerified?: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    phone?: string;
  };
}

export type PizzaBadge = 'Popular' | 'Spicy' | "Chef's Pick" | 'New' | null;

export interface Pizza {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: 'Classic' | 'Custom' | 'Chicken' | 'Veggie' | 'Specials';
  isAvailable: boolean;
  badge?: PizzaBadge;
  createdAt?: string;
}

export interface InventoryItem {
  _id: string;
  name: string;
  type: 'base' | 'sauce' | 'cheese' | 'vegetable';
  stock: number;
  threshold: number;
  unit: 'units' | 'kg' | 'litres';
  status?: 'OK' | 'Low' | 'Critical';
  updatedAt?: string;
}

export interface CustomizationOption {
  _id: string;
  type: 'base' | 'sauce' | 'cheese' | 'vegetable';
  name: string;
  description: string;
  priceModifier: number;
  image?: string;
  isAvailable: boolean;
}

export interface CustomizationSelection {
  base: CustomizationOption | null;
  sauce: CustomizationOption | null;
  cheese: CustomizationOption | null;
  vegetables: CustomizationOption[];
}

export interface CartItem {
  id: string; // unique item uuid in cart
  pizzaId?: string;
  name: string;
  image: string;
  isCustom: boolean;
  customization?: {
    base: string;
    sauce: string;
    cheese: string;
    vegetables: string[];
  };
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'order_received'
  | 'in_kitchen'
  | 'sent_to_delivery'
  | 'delivered';

export interface Order {
  _id: string;
  user: User | string;
  items: {
    _id?: string;
    pizza?: Pizza | string;
    name?: string;
    image?: string;
    customization?: {
      base: string;
      sauce: string;
      cheese: string;
      vegetables: string[];
    };
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AdminStats {
  totalOrdersCount: number;
  totalOrdersToday: number;
  revenueToday: number;
  totalRevenue: number;
  activeOrders: number;
  lowStockCount: number;
}
