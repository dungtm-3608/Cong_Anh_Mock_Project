import { ArrowLeft, MapPin, PackageCheck, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getOrder } from "../../services/orders";
import { useAuthStore } from "../../store/authStore";
import type { Order } from "../../types";
import { formatPrice } from "../../utils/money";
import {
  getOrderStatusClassName,
  getOrderStatusLabel,
} from "../../utils/orders";

export default function OrderDetailPage() {
  const { orderId = "" } = useParams();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle(order ? `Đơn ${order.orderNumber}` : "Chi tiết đơn hàng");

  useEffect(() => {
    if (!user || !orderId) {
      return;
    }

    const activeUser = user;
    let active = true;

    async function loadOrder() {
      setLoading(true);
      setError("");

      try {
        const data = await getOrder(orderId);

        if (!active) {
          return;
        }

        if (data.userId !== activeUser.id) {
          setOrder(null);
          setError("Bạn không có quyền xem đơn hàng này.");
          return;
        }

        setOrder(data);
      } catch {
        if (active) {
          setError("Không tìm thấy đơn hàng hoặc API chưa sẵn sàng.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [orderId, user]);

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
            <Link
              to="/don-hang"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary"
            >
              <ArrowLeft size={16} />
              Tất cả đơn hàng
            </Link>
            <h1
              className="mt-5 text-5xl leading-none sm:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Chi tiết đơn hàng
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          {error ? (
            <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="h-120 animate-pulse border border-border-soft bg-white" />
          ) : null}

          {order && !loading ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-8">
                <section className="border border-border-soft bg-white p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-muted">
                        Mã đơn
                      </p>
                      <h2
                        className="mt-2 text-4xl text-dark"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {order.orderNumber}
                      </h2>
                      <p className="mt-3 text-sm text-muted">
                        {new Intl.DateTimeFormat("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(order.createdAt))}
                      </p>
                    </div>

                    <span
                      className={`w-fit border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${getOrderStatusClassName(
                        order.status,
                      )}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                </section>

                <section className="border border-border-soft bg-white">
                  <div className="border-b border-border-soft px-6 py-5">
                    <h2
                      className="text-3xl text-dark"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Sản phẩm
                    </h2>
                  </div>

                  <div className="divide-y divide-border-soft">
                    {order.items.map((item) => (
                      <article
                        key={item.productId}
                        className="grid gap-5 px-6 py-5 md:grid-cols-[96px_minmax(0,1fr)_140px]"
                      >
                        <Link
                          to={`/san-pham/${item.slug}`}
                          className="flex h-24 items-center justify-center bg-[#f7f4ee] p-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        </Link>
                        <div>
                          <Link to={`/san-pham/${item.slug}`}>
                            <h3
                              className="text-3xl leading-tight text-dark"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {item.name}
                            </h3>
                          </Link>
                          <p className="mt-3 text-sm text-muted">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="text-xl font-semibold text-price md:text-right">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="border border-border-soft bg-white p-6">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-primary" />
                    <h2
                      className="text-3xl text-dark"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Thông tin nhận hàng
                    </h2>
                  </div>

                  <div className="mt-5 grid gap-4 text-sm text-muted md:grid-cols-2">
                    <div>
                      <p className="font-semibold text-dark">
                        {order.customer.name}
                      </p>
                      <p className="mt-2 inline-flex items-center gap-2">
                        <Phone size={15} />
                        {order.customer.phone}
                      </p>
                    </div>
                    <div>
                      <p>
                        {order.customer.address}, {order.customer.city}
                      </p>
                      {order.customer.note ? (
                        <p className="mt-2">Ghi chú: {order.customer.note}</p>
                      ) : null}
                    </div>
                  </div>
                </section>
              </div>

              <aside className="h-fit border border-border-soft bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.04)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center bg-primary text-white">
                    <PackageCheck size={19} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                      Thanh toán
                    </p>
                    <p className="mt-1 text-sm text-dark">Tổng kết đơn hàng</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 border-t border-border-soft pt-6 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Tạm tính</span>
                    <span className="font-semibold text-dark">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">
                      Giảm giá
                      {order.coupon ? ` (${order.coupon.code})` : ""}
                    </span>
                    <span className="font-semibold text-emerald-600">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Phí giao hàng</span>
                    <span className="font-semibold text-dark">
                      {order.shippingFee === 0
                        ? "Miễn phí"
                        : formatPrice(order.shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-border-soft pt-4 text-lg">
                    <span className="text-dark">Tổng thanh toán</span>
                    <span className="font-semibold text-price">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/don-hang"
                  className="mt-7 inline-flex w-full justify-center border border-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.26em] text-primary transition hover:bg-primary hover:text-white"
                >
                  Tất cả đơn hàng
                </Link>
              </aside>
            </div>
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
