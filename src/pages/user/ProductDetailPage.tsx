import { ArrowLeft, Minus, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ProductCard from "../../components/product/ProductCard";
import SectionTitle from "../../components/ui/SectionTitle";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getFeaturedProducts, getProductBySlug } from "../../services/products";
import { useCartStore } from "../../store/cartStore";
import type { Product } from "../../types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price);
}

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle(product ? product.name : "Chi tiết sản phẩm");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const [productData, featured] = await Promise.all([
          getProductBySlug(slug),
          getFeaturedProducts(4),
        ]);

        if (!active) {
          return;
        }

        if (!productData) {
          setError("Không tìm thấy sản phẩm.");
          setProduct(null);
          setRelatedProducts(featured);
          return;
        }

        setProduct(productData);
        setQuantity(1);
        setRelatedProducts(
          featured.filter((item) => item.slug !== productData.slug).slice(0, 3),
        );
      } catch {
        if (active) {
          setError(
            "Không thể tải chi tiết sản phẩm. Hãy kiểm tra json-server đang chạy.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  function changeQuantity(nextQuantity: number) {
    if (!product) {
      return;
    }

    setQuantity(Math.min(Math.max(1, nextQuantity), product.stock));
  }

  function handleAddToCart() {
    if (!product) {
      return;
    }

    addItem(product.id, quantity);
    toast.success("Đã thêm sản phẩm vào giỏ hàng.");
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Link
          to="/san-pham"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </Link>

        {error && !loading ? (
          <div className="mt-8 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="h-140 animate-pulse bg-white" />
            <div className="h-140 animate-pulse bg-white" />
          </div>
        ) : null}

        {product && !loading ? (
          <>
            <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
              <div className="overflow-hidden border border-border-soft bg-[linear-gradient(180deg,#f9f6f1,#ffffff)] p-8 shadow-[0_20px_45px_rgba(18,18,18,0.06)]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full max-h-140 w-full object-contain"
                />
              </div>

              <div className="self-center">
                <p className="text-xs uppercase tracking-[0.4em] text-primary">
                  {product.country}
                </p>
                <h1
                  className="mt-4 text-5xl leading-none text-dark"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {product.name}
                </h1>
                <div className="mt-5 flex items-center gap-3 text-sm text-muted">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        fill={
                          index < Math.round(product.rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span>{product.rating.toFixed(1)}</span>
                  <span>({product.reviewCount} đánh giá)</span>
                </div>

                <div className="mt-8 flex items-end gap-4">
                  <span className="text-4xl font-semibold text-price">
                    {formatPrice(product.price)}đ
                  </span>
                  {product.originalPrice ? (
                    <span className="pb-1 text-lg text-muted line-through">
                      {formatPrice(product.originalPrice)}đ
                    </span>
                  ) : null}
                </div>

                <p className="mt-8 text-sm leading-8 text-muted">
                  {product.description}
                </p>

                <div className="mt-10 grid gap-px overflow-hidden border border-border-soft bg-border-soft sm:grid-cols-2">
                  {[
                    { label: "Niên vụ", value: product.year ?? "N/A" },
                    { label: "Dung tích", value: product.volume },
                    { label: "Nồng độ", value: product.alcohol },
                    { label: "Tồn kho", value: `${product.stock} chai` },
                  ].map((item) => (
                    <div key={item.label} className="bg-white px-5 py-4">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-muted">
                        {item.label}
                      </p>
                      <p className="mt-2 text-xl text-dark">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="inline-flex h-12 w-fit items-center border border-border-soft bg-white">
                    <button
                      type="button"
                      onClick={() => changeQuantity(quantity - 1)}
                      className="flex h-12 w-12 items-center justify-center text-muted transition hover:text-dark"
                      aria-label="Giảm số lượng"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      value={quantity}
                      onChange={(event) =>
                        changeQuantity(Number(event.target.value) || 1)
                      }
                      className="h-12 w-16 border-x border-border-soft text-center text-sm outline-none"
                      inputMode="numeric"
                      aria-label="Số lượng"
                    />
                    <button
                      type="button"
                      onClick={() => changeQuantity(quantity + 1)}
                      className="flex h-12 w-12 items-center justify-center text-muted transition hover:text-dark"
                      aria-label="Tăng số lượng"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="inline-flex items-center justify-center gap-2 bg-dark px-7 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-dark-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Thêm vào giỏ
                  </button>
                  <Link
                    to="/gio-hang"
                    className="border border-primary px-7 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-primary transition hover:bg-primary hover:text-white"
                  >
                    Xem giỏ hàng
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-20">
              <SectionTitle
                title="Gợi ý thêm"
                subtitle="Một vài chai đang được xem nhiều để bạn tiếp tục khám phá."
              />
              <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {relatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          </>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
