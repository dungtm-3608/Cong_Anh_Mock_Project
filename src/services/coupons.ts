import type { Coupon } from "../types";
import api from "./api";

export interface CouponCheckResult {
  valid: boolean;
  message: string;
  coupon: Coupon | null;
  discount: number;
}

export async function getCoupons() {
  const response = await api.get<Coupon[]>("/coupons");

  return response.data.filter((coupon) => coupon.active);
}

export function calculateCouponDiscount(coupon: Coupon, subtotal: number) {
  if (coupon.type === "fixed") {
    return Math.min(coupon.value, subtotal);
  }

  const rawDiscount = Math.round((subtotal * coupon.value) / 100);

  return coupon.maxDiscount
    ? Math.min(rawDiscount, coupon.maxDiscount)
    : rawDiscount;
}

export async function checkCoupon(code: string, subtotal: number) {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      valid: false,
      message: "Vui lòng nhập hoặc chọn mã giảm giá.",
      coupon: null,
      discount: 0,
    } satisfies CouponCheckResult;
  }

  const coupons = await getCoupons();
  const coupon = coupons.find((item) => item.code.toUpperCase() === normalizedCode);

  if (!coupon) {
    return {
      valid: false,
      message: "Mã giảm giá không tồn tại hoặc đã bị tắt.",
      coupon: null,
      discount: 0,
    } satisfies CouponCheckResult;
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return {
      valid: false,
      message: "Mã giảm giá đã hết hạn.",
      coupon,
      discount: 0,
    } satisfies CouponCheckResult;
  }

  if (subtotal < coupon.minOrder) {
    return {
      valid: false,
      message: `Đơn hàng cần đạt tối thiểu ${new Intl.NumberFormat("vi-VN").format(
        coupon.minOrder,
      )}đ để dùng mã này.`,
      coupon,
      discount: 0,
    } satisfies CouponCheckResult;
  }

  return {
    valid: true,
    message: "Mã giảm giá có thể sử dụng.",
    coupon,
    discount: calculateCouponDiscount(coupon, subtotal),
  } satisfies CouponCheckResult;
}
