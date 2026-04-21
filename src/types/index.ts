export interface Address {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  isDefault: boolean;
}

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
