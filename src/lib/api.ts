// API client for the separate TypeScript server

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Products API
  async getProducts() {
    return this.request<Product[]>('/api/products');
  }

  async getProduct(id: number) {
    return this.request<Product>(`/api/products/${id}`);
  }

  async createProduct(product: CreateProductData) {
    return this.request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: number, product: UpdateProductData) {
    return this.request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: number) {
    return this.request<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders API
  async getOrders() {
    return this.request<Order[]>('/api/orders');
  }

  async getOrder(id: number) {
    return this.request<Order>(`/api/orders/${id}`);
  }

  async createOrder(order: CreateOrderData) {
    return this.request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updateOrder(id: number, order: UpdateOrderData) {
    return this.request<Order>(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  }

  async deleteOrder(id: number) {
    return this.request<{ message: string }>(`/api/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Order Items API
  async addOrderItem(orderId: number, item: CreateOrderItemData) {
    return this.request<OrderItem>(`/api/orders/${orderId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateOrderItem(orderId: number, itemId: number, item: CreateOrderItemData) {
    return this.request<OrderItem>(`/api/orders/${orderId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async removeOrderItem(orderId: number, itemId: number) {
    return this.request<{ message: string }>(`/api/orders/${orderId}/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Dashboard API
  async getDashboardStats() {
    return this.request<DashboardStats>('/api/dashboard/stats');
  }

  async getRevenueAnalytics(period: string = '7d') {
    return this.request<RevenueAnalytics>(`/api/dashboard/revenue?period=${period}`);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string; environment: string }>('/health');
  }
}

// Types
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

export interface CreateProductData {
  name: string;
  price: number;
  category: string;
  description: string;
}

export interface UpdateProductData {
  name?: string;
  price?: number;
  category?: string;
  description?: string;
  isActive?: boolean;
}

export interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface CreateOrderData {
  customerName: string;
  orderItems: CreateOrderItemData[];
}

export interface UpdateOrderData {
  customerName?: string;
  orderItems?: CreateOrderItemData[];
}

export interface CreateOrderItemData {
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
  topProducts: Array<{
    product: Product;
    totalQuantity: number;
    orderCount: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
  }>;
}

export interface RevenueAnalytics {
  period: string;
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  orders: Array<{
    amount: number;
    date: string;
  }>;
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
