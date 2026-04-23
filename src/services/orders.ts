import type {
  AppliedCoupon,
  CheckoutInfo,
  Order,
  OrderItem,
  OrderStatus,
} from "../types";
import api from "./api";

interface CreateOrderPayload {
  userId: string;
  items: OrderItem[];
  customer: CheckoutInfo;
  coupon?: AppliedCoupon | null;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}

function createOrderNumber() {
  const date = new Date();
  const datePart = date
    .toLocaleDateString("vi-VN", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `WH${datePart}${randomPart}`;
}

export async function createOrder(payload: CreateOrderPayload) {
  const now = new Date().toISOString();
  const newOrder: Omit<Order, "id"> = {
    ...payload,
    orderNumber: createOrderNumber(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const response = await api.post<Order>("/orders", newOrder);

  return response.data;
}

export async function getOrder(orderId: string) {
  const response = await api.get<Order>(`/orders/${orderId}`);

  return response.data;
}

export async function getOrdersByUser(userId: string) {
  const response = await api.get<Order[]>("/orders", {
    params: { userId },
  });

  return response.data.sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  );
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const response = await api.patch<Order>(`/orders/${orderId}`, {
    status,
    updatedAt: new Date().toISOString(),
  });

  return response.data;
}
