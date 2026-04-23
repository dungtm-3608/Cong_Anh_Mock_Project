import { BadgeCheck, MapPin, TicketPercent } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import Input from "../../components/ui/Input";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import {
  calculateCouponDiscount,
  checkCoupon,
  getCoupons,
} from "../../services/coupons";
import { createOrder } from "../../services/orders";
import { getProductsByIds } from "../../services/products";
import { updateUserCheckoutProfiles } from "../../services/users";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import type { CheckoutInfo, CheckoutProfile, Coupon, Product } from "../../types";
import {
  applyDefaultCheckoutProfile,
  createCheckoutProfile,
  getUserCheckoutProfiles,
} from "../../utils/checkoutProfiles";
import { formatPrice } from "../../utils/money";

interface CheckoutFormValues extends CheckoutInfo {
  saveProfile: boolean;
  profileLabel: string;
  setDefaultProfile: boolean;
  couponCode: string;
}

const emptyFormValues: CheckoutFormValues = {
  name: "",
  phone: "",
  address: "",
  city: "",
  note: "",
  saveProfile: false,
  profileLabel: "",
  setDefaultProfile: false,
  couponCode: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const cartItems = useCartStore((state) => state.items);
  const removeItems = useCartStore((state) => state.removeItems);
  const profiles = useMemo(() => getUserCheckoutProfiles(user), [user]);
  const defaultProfile = useMemo(
    () => profiles.find((profile) => profile.isDefault) ?? profiles[0],
    [profiles],
  );
  const initialFormValues = useMemo(
    () =>
      defaultProfile
        ? {
            ...emptyFormValues,
            name: defaultProfile.name,
            phone: defaultProfile.phone,
            address: defaultProfile.address,
            city: defaultProfile.city,
            note: defaultProfile.note ?? "",
          }
        : {
            ...emptyFormValues,
            name: user?.name ?? "",
            phone: user?.phone ?? "",
          },
    [defaultProfile, user],
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState(
    defaultProfile?.id ?? "",
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: initialFormValues,
  });

  const couponCode = useWatch({ control, name: "couponCode" }) ?? "";
  const saveProfile = Boolean(useWatch({ control, name: "saveProfile" }));

  useDocumentTitle("Thanh toán");

  const selectedCartItems = useMemo(() => {
    const requestedIds = searchParams
      .get("items")
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!requestedIds || requestedIds.length === 0) {
      return cartItems;
    }

    const requestedIdSet = new Set(requestedIds);

    return cartItems.filter((item) => requestedIdSet.has(item.productId));
  }, [cartItems, searchParams]);

  const applyProfile = useCallback(
    (profile: CheckoutProfile) => {
      setSelectedProfileId(profile.id);
      setValue("name", profile.name);
      setValue("phone", profile.phone);
      setValue("address", profile.address);
      setValue("city", profile.city);
      setValue("note", profile.note ?? "");
    },
    [setValue],
  );

  useEffect(() => {
    let active = true;
    const productIds = selectedCartItems.map((item) => item.productId);

    async function loadCheckoutData() {
      if (productIds.length === 0) {
        setProducts([]);
        setCoupons([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [productData, couponData] = await Promise.all([
          getProductsByIds(productIds),
          getCoupons(),
        ]);

        if (!active) {
          return;
        }

        setProducts(productData);
        setCoupons(couponData);
      } catch {
        if (active) {
          setError(
            "Không thể tải dữ liệu thanh toán. Hãy kiểm tra json-server đang chạy.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCheckoutData();

    return () => {
      active = false;
    };
  }, [selectedCartItems]);

  const checkoutDetails = useMemo(
    () =>
      selectedCartItems
        .map((item) => ({
          ...item,
          product: products.find((product) => product.id === item.productId),
        }))
        .filter(
          (item): item is typeof item & { product: Product } =>
            Boolean(item.product),
        ),
    [products, selectedCartItems],
  );

  const subtotal = checkoutDetails.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const couponStillValid = Boolean(
    appliedCoupon &&
      appliedCoupon.active &&
      subtotal >= appliedCoupon.minOrder,
  );
  const discount = couponStillValid && appliedCoupon
    ? calculateCouponDiscount(appliedCoupon, subtotal)
    : 0;
  const shippingFee = subtotal === 0 || subtotal >= 3000000 ? 0 : 40000;
  const total = Math.max(0, subtotal - discount + shippingFee);

  async function handleCheckCoupon(targetCode = couponCode) {
    try {
      setCheckingCoupon(true);
      const result = await checkCoupon(targetCode, subtotal);
      setCouponMessage(result.message);

      if (result.valid && result.coupon) {
        setAppliedCoupon(result.coupon);
        setValue("couponCode", result.coupon.code);
        toast.success(result.message);
        return result;
      }

      setAppliedCoupon(null);
      toast.error(result.message);
      return result;
    } catch {
      const message = "Không thể kiểm tra mã giảm giá.";
      setCouponMessage(message);
      setAppliedCoupon(null);
      toast.error(message);

      return {
        valid: false,
        message,
        coupon: null,
        discount: 0,
      };
    } finally {
      setCheckingCoupon(false);
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!user) {
      return;
    }

    if (checkoutDetails.length === 0) {
      toast.error("Không có sản phẩm nào để thanh toán.");
      return;
    }

    const outOfStockItem = checkoutDetails.find(
      (item) => item.quantity > item.product.stock,
    );

    if (outOfStockItem) {
      toast.error(`${outOfStockItem.product.name} không đủ số lượng tồn kho.`);
      return;
    }

    try {
      setSubmitting(true);
      let orderCoupon = appliedCoupon;
      let orderDiscount = discount;

      if (values.couponCode.trim()) {
        const result = await handleCheckCoupon(values.couponCode);

        if (!result.valid || !result.coupon) {
          return;
        }

        orderCoupon = result.coupon;
        orderDiscount = result.discount;
      }

      if (values.saveProfile) {
        const shouldBeDefault = values.setDefaultProfile || profiles.length === 0;
        const newProfile = createCheckoutProfile({
          label:
            values.profileLabel.trim() ||
            `${values.name.trim()} - ${values.city.trim()}`,
          name: values.name.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          note: values.note?.trim() ?? "",
          isDefault: shouldBeDefault,
        });
        const nextProfiles = shouldBeDefault
          ? applyDefaultCheckoutProfile([...profiles, newProfile], newProfile.id)
          : [...profiles, newProfile];
        const updatedUser = await updateUserCheckoutProfiles(user.id, nextProfiles);

        updateUser({
          checkoutProfiles: updatedUser.checkoutProfiles ?? nextProfiles,
        });
      }

      const order = await createOrder({
        userId: user.id,
        items: checkoutDetails.map((item) => ({
          productId: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          image: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity,
        })),
        customer: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          note: values.note?.trim() ?? "",
        },
        coupon: orderCoupon
          ? {
              code: orderCoupon.code,
              label: orderCoupon.label,
              discount: orderDiscount,
            }
          : null,
        subtotal,
        discount: orderDiscount,
        shippingFee,
        total: Math.max(0, subtotal - orderDiscount + shippingFee),
      });

      removeItems(checkoutDetails.map((item) => item.productId));
      toast.success("Thanh toán thành công. Đơn hàng đã được tạo.");
      navigate(`/don-hang/${order.id}`);
    } catch {
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  });

  if (!user) {
    return (
      <Navigate
        to="/dang-nhap"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main>
        <section className="bg-dark text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-xs uppercase tracking-[0.42em] text-primary">
              Checkout
            </p>
            <h1
              className="mt-4 text-5xl leading-none sm:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Thanh toán
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
              Xác nhận thông tin giao hàng, lưu bộ thông tin dùng lại và áp mã
              ưu đãi trước khi tạo đơn.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            {error ? (
              <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {loading ? (
              <div className="h-120 animate-pulse border border-border-soft bg-white" />
            ) : null}

            {!loading && checkoutDetails.length === 0 ? (
              <div className="border border-border-soft bg-white px-6 py-14 text-center">
                <h2
                  className="text-4xl text-dark"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Chưa có sản phẩm thanh toán
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
                  Quay lại giỏ hàng để chọn sản phẩm cần thanh toán.
                </p>
                <Link
                  to="/gio-hang"
                  className="mt-8 inline-flex bg-dark px-7 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-dark-2"
                >
                  Về giỏ hàng
                </Link>
              </div>
            ) : null}

            {!loading && checkoutDetails.length > 0 ? (
              <>
                <section className="border border-border-soft bg-white p-6">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-primary" />
                    <h2
                      className="text-3xl text-dark"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Thông tin giao hàng
                    </h2>
                  </div>

                  {profiles.length > 0 ? (
                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      {profiles.map((profile) => (
                        <button
                          key={profile.id}
                          type="button"
                          onClick={() => applyProfile(profile)}
                          className={`border px-4 py-4 text-left transition ${
                            selectedProfileId === profile.id
                              ? "border-primary bg-primary-light/40"
                              : "border-border-soft hover:border-primary"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-dark">
                                {profile.label}
                              </p>
                              <p className="mt-2 text-sm text-muted">
                                {profile.name} - {profile.phone}
                              </p>
                            </div>
                            {profile.isDefault ? (
                              <BadgeCheck size={18} className="text-primary" />
                            ) : null}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-muted">
                            {profile.address}, {profile.city}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <form onSubmit={onSubmit} className="mt-8 grid gap-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <Input
                        label="Họ và tên *"
                        placeholder="Nguyễn Văn A"
                        error={errors.name?.message}
                        {...register("name", {
                          required: "Vui lòng nhập họ tên.",
                          minLength: {
                            value: 2,
                            message: "Họ tên tối thiểu 2 ký tự.",
                          },
                        })}
                      />
                      <Input
                        label="Số điện thoại *"
                        placeholder="0909..."
                        error={errors.phone?.message}
                        {...register("phone", {
                          required: "Vui lòng nhập số điện thoại.",
                          pattern: {
                            value: /^(0|\+84)\d{9,10}$/,
                            message: "Số điện thoại không hợp lệ.",
                          },
                        })}
                      />
                    </div>

                    <Input
                      label="Địa chỉ *"
                      placeholder="Số nhà, đường, phường/xã"
                      error={errors.address?.message}
                      {...register("address", {
                        required: "Vui lòng nhập địa chỉ.",
                        minLength: {
                          value: 5,
                          message: "Địa chỉ tối thiểu 5 ký tự.",
                        },
                      })}
                    />

                    <Input
                      label="Tỉnh/thành phố *"
                      placeholder="Hà Nội, TP. Hồ Chí Minh..."
                      error={errors.city?.message}
                      {...register("city", {
                        required: "Vui lòng nhập tỉnh/thành phố.",
                      })}
                    />

                    <label>
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-dark">
                        Ghi chú
                      </span>
                      <textarea
                        rows={4}
                        placeholder="Thời gian giao, chỉ dẫn thêm..."
                        className="w-full border border-border bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-primary"
                        {...register("note")}
                      />
                    </label>

                    <div className="border border-border-soft bg-surface p-4">
                      <label className="flex items-center gap-3 text-sm text-dark">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-primary"
                          {...register("saveProfile")}
                        />
                        Lưu bộ thông tin này để dùng lại
                      </label>

                      {saveProfile ? (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <Input
                            label="Tên bộ thông tin"
                            placeholder="Nhà riêng, Công ty..."
                            {...register("profileLabel")}
                          />
                          <label className="flex items-center gap-3 self-end pb-3 text-sm text-dark">
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-primary"
                              {...register("setDefaultProfile")}
                            />
                            Đặt làm mặc định
                          </label>
                        </div>
                      ) : null}
                    </div>

                    <section className="border border-border-soft p-5">
                      <div className="flex items-center gap-3">
                        <TicketPercent size={20} className="text-primary" />
                        <h2
                          className="text-3xl text-dark"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          Mã giảm giá
                        </h2>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                        <Input
                          placeholder="WELCOME10"
                          inputClassName="uppercase"
                          {...register("couponCode")}
                        />
                        <button
                          type="button"
                          onClick={() => void handleCheckCoupon()}
                          disabled={checkingCoupon || subtotal === 0}
                          className="bg-dark px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-dark-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {checkingCoupon ? "Đang kiểm tra" : "Kiểm tra"}
                        </button>
                      </div>

                      {couponMessage ? (
                        <p
                          className={`mt-3 text-sm ${
                            appliedCoupon && couponStillValid
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {couponMessage}
                        </p>
                      ) : null}

                      {coupons.length > 0 ? (
                        <div className="mt-5 grid gap-3 md:grid-cols-3">
                          {coupons.map((coupon) => (
                            <button
                              key={coupon.id}
                              type="button"
                              onClick={() => {
                                setValue("couponCode", coupon.code);
                                void handleCheckCoupon(coupon.code);
                              }}
                              className="border border-border-soft px-4 py-3 text-left transition hover:border-primary"
                            >
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                {coupon.code}
                              </p>
                              <p className="mt-2 text-sm text-dark">
                                {coupon.label}
                              </p>
                              <p className="mt-2 text-xs leading-5 text-muted">
                                {coupon.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </section>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 bg-dark px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-dark-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? "Đang tạo đơn" : "Hoàn tất thanh toán"}
                    </button>
                  </form>
                </section>
              </>
            ) : null}
          </div>

          <aside className="h-fit border border-border-soft bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
              Đơn hàng
            </p>
            <h2
              className="mt-2 text-3xl text-dark"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tóm tắt
            </h2>

            <div className="mt-6 divide-y divide-border-soft border-y border-border-soft">
              {checkoutDetails.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 py-4"
                >
                  <div className="flex h-16 items-center justify-center bg-[#f7f4ee] p-2">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="line-clamp-2 text-sm font-semibold text-dark">
                      {item.product.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {item.quantity} x {formatPrice(item.product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Tạm tính</span>
                <span className="font-semibold text-dark">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">Giảm giá</span>
                <span className="font-semibold text-emerald-600">
                  -{formatPrice(discount)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">Phí giao hàng</span>
                <span className="font-semibold text-dark">
                  {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-border-soft pt-4 text-lg">
                <span className="text-dark">Tổng thanh toán</span>
                <span className="font-semibold text-price">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
