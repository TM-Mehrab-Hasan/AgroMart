// User Types
export type UserRole = 'admin' | 'customer' | 'shop_owner' | 'seller' | 'rider';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Product Types
export type ProductCategory = 'crops' | 'vegetables' | 'dairy' | 'fish';
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';
export type ProductUnit = 'kg' | 'lbs' | 'piece' | 'liter' | 'dozen';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  stockQuantity: number;
  minOrderQuantity: number;
  images: string[];
  sellerId: string;
  seller: User;
  shopId?: string;
  shop?: Shop;
  status: ProductStatus;
  isOrganic: boolean;
  harvestDate?: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  location?: string;
  sellerId?: string;
  shopId?: string;
}

// Shop Types
export interface Shop {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  owner: User;
  address: Address;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  commission: number; // percentage
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready_for_pickup' 
  | 'picked_up' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentMethod = 
  | 'cash_on_delivery' 
  | 'bkash' 
  | 'nagad' 
  | 'rocket' 
  | 'bank_transfer' 
  | 'stripe';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: User;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  codFee?: number; // Cash on delivery fee
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address;
  riderId?: string;
  rider?: User;
  estimatedDeliveryTime?: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  shopId?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

// Delivery Types
export interface DeliveryArea {
  id: string;
  name: string;
  boundaries: string; // GeoJSON or similar
  deliveryFee: number;
  estimatedDeliveryTime: number; // in minutes
  isActive: boolean;
}

export interface RiderProfile {
  id: string;
  userId: string;
  user: User;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  isVerified: boolean;
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  deliveryAreas: DeliveryArea[];
  totalDeliveries: number;
  rating: number;
}

// Review Types
export interface Review {
  id: string;
  orderId: string;
  productId?: string;
  shopId?: string;
  riderId?: string;
  customerId: string;
  customer: User;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Notification Types
export type NotificationType = 
  | 'order_placed' 
  | 'order_confirmed' 
  | 'order_delivered' 
  | 'payment_received' 
  | 'new_product' 
  | 'stock_low' 
  | 'system_announcement';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

// Analytics Types
export interface SalesAnalytics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Product[];
  salesByCategory: Record<ProductCategory, number>;
  salesByMonth: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  activeRiders: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface ProductForm {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  stockQuantity: number;
  minOrderQuantity: number;
  isOrganic: boolean;
  harvestDate?: Date;
  expiryDate?: Date;
  images: File[];
}