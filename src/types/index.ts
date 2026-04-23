export interface Address {
  id: number | string;
  name: string;
  phone: string;
  street: string;
  city: string;
  isDefault: boolean;
}

export interface CheckoutProfile {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isActive: boolean;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  checkoutProfiles?: CheckoutProfile[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: number;
  price: number;
  originalPrice?: number | null;
  description: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  country: string;
  alcohol: string;
  volume: string;
  year?: number | null;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export type CouponType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  label: string;
  description: string;
  type: CouponType;
  value: number;
  minOrder: number;
  maxDiscount?: number;
  active: boolean;
  expiresAt?: string;
}

export interface AppliedCoupon {
  code: string;
  label: string;
  discount: number;
}

export interface CheckoutInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "completed"
  | "cancelled";

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  customer: CheckoutInfo;
  coupon?: AppliedCoupon | null;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
