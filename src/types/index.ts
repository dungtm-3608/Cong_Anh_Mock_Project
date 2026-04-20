export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isActive: boolean;
  avatar?: string;
  phone?: string;
  addresses: Address[];
}

export interface Address {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  isDefault: boolean;
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  country: string;
  alcohol: string;
  volume: string;
  year: number | null;
}
export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  selected: boolean;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  shippingAddress: Address;
  voucherCode?: string;
  discountAmount?: number;
  note?: string;
  createdAt: string;
}

export interface Voucher {
  id: number;
  code: string;
  discount: number;
  type: "percent" | "fixed";
  minOrder: number;
  expiryDate: string;
  isActive: boolean;
}

export interface Comment {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: number;
  productId: number;
  orderId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}
