import type { OrderStatus } from "../types";

export const orderStatusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã hủy" },
];

export function getOrderStatusLabel(status: OrderStatus) {
  return (
    orderStatusOptions.find((item) => item.value === status)?.label ??
    "Không xác định"
  );
}

export function getOrderStatusClassName(status: OrderStatus) {
  const classNames: Record<OrderStatus, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    confirmed: "border-sky-200 bg-sky-50 text-sky-700",
    shipping: "border-indigo-200 bg-indigo-50 text-indigo-700",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
  };

  return classNames[status];
}
