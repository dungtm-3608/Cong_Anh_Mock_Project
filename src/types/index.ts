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
