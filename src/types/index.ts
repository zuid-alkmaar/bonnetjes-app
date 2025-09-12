export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  activeProducts: number;
  recentOrders: Order[];
}
