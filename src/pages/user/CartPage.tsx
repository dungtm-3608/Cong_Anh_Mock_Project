import { Check, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getProductsByIds } from "../../services/products";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import type { Product } from "../../types";
import { formatPrice } from "../../utils/money";

export default function CartPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const removeItems = useCartStore((state) => state.removeItems);
  const initialSelectedIds = cartItems.map((item) => item.productId);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle("Giỏ hàng");

  useEffect(() => {
    let active = true;
    const productIds = cartItems.map((item) => item.productId);

    async function loadProducts() {
      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getProductsByIds(productIds);

        if (active) {
          setProducts(data);
        }
      } catch {
        if (active) {
          setError(
            "Không thể tải giỏ hàng. Hãy kiểm tra json-server đang chạy.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, [cartItems]);

  const cartDetails = useMemo(
    () =>
      cartItems
        .map((item) => ({
          ...item,
          product: products.find((product) => product.id === item.productId),
        }))
        .filter(
          (item): item is typeof item & { product: Product } =>
            Boolean(item.product),
        ),
    [cartItems, products],
  );

  const validSelectedIds = useMemo(() => {
    const cartProductIds = new Set(cartDetails.map((item) => item.productId));

    return selectedIds.filter((productId) => cartProductIds.has(productId));
  }, [cartDetails, selectedIds]);

  const selectedDetails = useMemo(
    () =>
      cartDetails.filter((item) => validSelectedIds.includes(item.productId)),
    [cartDetails, validSelectedIds],
  );

  const subtotal = selectedDetails.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const allSelected =
    cartDetails.length > 0 && selectedDetails.length === cartDetails.length;

  function toggleProduct(productId: string) {
    setSelectedIds((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId],
    );
  }

  function toggleAllProducts() {
    setSelectedIds(allSelected ? [] : cartDetails.map((item) => item.productId));
  }

  function changeQuantity(product: Product, quantity: number) {
    const nextQuantity = Math.min(Math.max(1, quantity), product.stock);
    setQuantity(product.id, nextQuantity);
  }

  function removeSelectedProducts() {
    if (validSelectedIds.length === 0) {
      toast.error("Vui lòng chọn sản phẩm cần xóa.");
      return;
    }

    removeItems(validSelectedIds);
    toast.success("Đã xóa sản phẩm đã chọn khỏi giỏ hàng.");
  }

  function handleCheckout() {
    if (validSelectedIds.length === 0) {
      toast.error("Vui lòng chọn sản phẩm muốn thanh toán.");
      return;
    }

    const checkoutPath = `/thanh-toan?items=${validSelectedIds.join(",")}`;

    if (!user) {
      toast.error("Vui lòng đăng nhập để tiếp tục thanh toán.");
      navigate("/dang-nhap", { state: { from: checkoutPath } });
      return;
    }

    navigate(checkoutPath);
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main>
        <section className="bg-dark text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-xs uppercase tracking-[0.42em] text-primary">
              Shopping Cart
            </p>
            <h1
              className="mt-4 text-5xl leading-none sm:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Giỏ hàng
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
              Chọn từng chai muốn thanh toán, điều chỉnh số lượng và kiểm tra
              tổng tiền trước khi chuyển sang bước giao hàng.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex flex-col gap-4 border-b border-border-soft pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-dark">
                  {cartQuantity} sản phẩm trong giỏ
                </p>
                <p className="mt-1 text-sm text-muted">
                  Đã chọn {selectedDetails.length} dòng sản phẩm để thanh toán.
                </p>
              </div>

              {cartDetails.length > 0 ? (
                <button
                  type="button"
                  onClick={removeSelectedProducts}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-600"
                >
                  <Trash2 size={16} />
                  Xóa đã chọn
                </button>
              ) : null}
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
                    className="h-36 animate-pulse border border-border-soft bg-white"
                  />
                ))}
              </div>
            ) : null}

            {!loading && cartDetails.length === 0 ? (
              <div className="mt-8 border border-border-soft bg-white px-6 py-14 text-center">
                <h2
                  className="text-4xl text-dark"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Giỏ hàng đang trống
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
                  Chọn thêm sản phẩm từ catalogue để bắt đầu tạo đơn hàng.
                </p>
                <Link
                  to="/san-pham"
                  className="mt-8 inline-flex bg-dark px-7 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-dark-2"
                >
                  Xem sản phẩm
                </Link>
              </div>
            ) : null}

            {!loading && cartDetails.length > 0 ? (
              <div className="mt-8 overflow-hidden border border-border-soft bg-white">
                <label className="flex items-center gap-3 border-b border-border-soft px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAllProducts}
                    className="h-4 w-4 accent-primary"
                  />
                  Chọn tất cả
                </label>

                <div className="divide-y divide-border-soft">
                  {cartDetails.map((item) => (
                    <article
                      key={item.productId}
                      className="grid gap-5 px-5 py-6 md:grid-cols-[auto_120px_minmax(0,1fr)_150px]"
                    >
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          checked={validSelectedIds.includes(item.productId)}
                          onChange={() => toggleProduct(item.productId)}
                          className="h-4 w-4 accent-primary"
                          aria-label={`Chọn ${item.product.name}`}
                        />
                      </div>

                      <Link
                        to={`/san-pham/${item.product.slug}`}
                        className="flex h-32 items-center justify-center bg-[#f7f4ee] p-4"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </Link>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-primary">
                          {item.product.country}
                        </p>
                        <Link to={`/san-pham/${item.product.slug}`}>
                          <h2
                            className="mt-2 text-3xl leading-tight text-dark"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {item.product.name}
                          </h2>
                        </Link>
                        <p className="mt-3 text-sm text-muted">
                          Còn {item.product.stock} chai trong kho
                        </p>
                        <p className="mt-4 text-xl font-semibold text-price">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-start justify-between gap-5 md:items-end">
                        <div className="inline-flex h-11 items-center border border-border-soft">
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(item.product, item.quantity - 1)
                            }
                            className="flex h-11 w-11 items-center justify-center text-muted transition hover:text-dark"
                            aria-label="Giảm số lượng"
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            value={item.quantity}
                            onChange={(event) =>
                              changeQuantity(
                                item.product,
                                Number(event.target.value) || 1,
                              )
                            }
                            className="h-11 w-14 border-x border-border-soft text-center text-sm outline-none"
                            inputMode="numeric"
                            aria-label="Số lượng"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(item.product, item.quantity + 1)
                            }
                            className="flex h-11 w-11 items-center justify-center text-muted transition hover:text-dark"
                            aria-label="Tăng số lượng"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            removeItem(item.productId);
                            toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
                          }}
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted transition hover:text-red-600"
                        >
                          <Trash2 size={15} />
                          Xóa
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="h-fit border border-border-soft bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.04)]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center bg-primary text-white">
                <Check size={18} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                  Tạm tính
                </p>
                <p className="mt-1 text-sm text-dark">Sản phẩm đã chọn</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-border-soft pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Dòng sản phẩm</span>
                <span className="font-semibold text-dark">
                  {selectedDetails.length}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">Số lượng</span>
                <span className="font-semibold text-dark">
                  {selectedDetails.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-lg">
                <span className="text-dark">Tổng tiền</span>
                <span className="font-semibold text-price">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={validSelectedIds.length === 0}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-dark px-6 py-4 text-xs font-semibold uppercase tracking-[0.26em] text-white transition hover:bg-dark-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Thanh toán
            </button>

            <Link
              to="/san-pham"
              className="mt-4 inline-flex w-full justify-center border border-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.26em] text-primary transition hover:bg-primary hover:text-white"
            >
              Tiếp tục mua
            </Link>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
