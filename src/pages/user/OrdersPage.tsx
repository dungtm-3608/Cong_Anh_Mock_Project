import { PackageSearch, Search } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getOrdersByUser } from "../../services/orders";
import { useAuthStore } from "../../store/authStore";
import type { Order, OrderStatus } from "../../types";
import { formatPrice } from "../../utils/money";
import {
  getOrderStatusClassName,
  getOrderStatusLabel,
  orderStatusOptions,
} from "../../utils/orders";

function isOrderStatus(value: string): value is OrderStatus {
  return ["pending", "confirmed", "shipping", "completed", "cancelled"].includes(
    value,
  );
}

export default function OrdersPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const query = searchParams.get("q") ?? "";
  const statusParam = searchParams.get("status") ?? "all";
  const selectedStatus = isOrderStatus(statusParam) ? statusParam : "all";

  useDocumentTitle("Đơn hàng của tôi");

  useEffect(() => {
    if (!user) {
      return;
    }

    const activeUser = user;
    let active = true;

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const data = await getOrdersByUser(activeUser.id);

        if (active) {
          setOrders(data);
        }
      } catch {
        if (active) {
          setError(
            "Không thể tải đơn hàng. Hãy kiểm tra json-server đang chạy.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      active = false;
    };
  }, [user]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        order.orderNumber,
        order.customer.name,
        order.customer.phone,
        order.customer.address,
        order.customer.city,
        getOrderStatusLabel(order.status),
        ...order.items.map((item) => item.name),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [orders, query, selectedStatus]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchInputRef.current?.value.trim() ?? "";
    const nextParams: Record<string, string> = {};

    if (nextQuery) {
      nextParams.q = nextQuery;
    }

    if (selectedStatus !== "all") {
      nextParams.status = selectedStatus;
    }

    setSearchParams(nextParams);
  }

  function handleStatusChange(status: OrderStatus | "all") {
    const nextParams: Record<string, string> = {};

    if (query) {
      nextParams.q = query;
    }

    if (status !== "all") {
      nextParams.status = status;
    }

    setSearchParams(nextParams);
  }

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
              My Orders
            </p>
            <h1
              className="mt-4 text-5xl leading-none sm:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Đơn hàng của tôi
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
              Theo dõi đơn đã tạo, tìm theo mã đơn hoặc sản phẩm và lọc nhanh
              theo trạng thái xử lý.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 border border-border-soft bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.04)] lg:grid-cols-[1fr_auto] lg:items-end">
            <form
              key={query}
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label className="relative block flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  ref={searchInputRef}
                  defaultValue={query}
                  placeholder="Tìm mã đơn, tên sản phẩm, địa chỉ..."
                  className="w-full border border-border bg-surface py-4 pl-12 pr-4 text-sm outline-none transition focus:border-primary"
                />
              </label>
              <button className="bg-dark px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-dark-2">
                Tìm kiếm
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {orderStatusOptions.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => handleStatusChange(status.value)}
                  className={`border px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    selectedStatus === status.value
                      ? "border-primary bg-primary text-white"
                      : "border-border-soft text-muted hover:border-primary hover:text-primary"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="mt-8 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-8 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse border border-border-soft bg-white"
                />
              ))}
            </div>
          ) : null}

          {!loading && filteredOrders.length === 0 ? (
            <div className="mt-8 border border-border-soft bg-white px-6 py-14 text-center">
              <PackageSearch size={38} className="mx-auto text-primary" />
              <h2
                className="mt-4 text-4xl text-dark"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Không tìm thấy đơn hàng
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
                Thử đổi từ khóa tìm kiếm hoặc chọn trạng thái khác.
              </p>
            </div>
          ) : null}

          {!loading && filteredOrders.length > 0 ? (
            <div className="mt-8 space-y-4">
              {filteredOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/don-hang/${order.id}`}
                  className="grid gap-5 border border-border-soft bg-white p-5 transition hover:border-primary md:grid-cols-[minmax(0,1fr)_180px]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dark">
                        {order.orderNumber}
                      </p>
                      <span
                        className={`border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getOrderStatusClassName(
                          order.status,
                        )}`}
                      >
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted">
                      {new Intl.DateTimeFormat("vi-VN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(order.createdAt))}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                      {order.items.slice(0, 3).map((item) => (
                        <span
                          key={item.productId}
                          className="border border-border-soft px-3 py-2"
                        >
                          {item.quantity} x {item.name}
                        </span>
                      ))}
                      {order.items.length > 3 ? (
                        <span className="border border-border-soft px-3 py-2">
                          +{order.items.length - 3} sản phẩm
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-4 md:text-right">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted">
                        Tổng thanh toán
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-price">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      Xem chi tiết
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
