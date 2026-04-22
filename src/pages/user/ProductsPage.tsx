import { Search } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ProductCard from "../../components/product/ProductCard";
import SectionTitle from "../../components/ui/SectionTitle";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getProducts } from "../../services/products";
import type { Product } from "../../types";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get("q") ?? "";

  useDocumentTitle("Tất cả sản phẩm");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await getProducts(searchParams.get("q") ?? "");

        if (active) {
          setProducts(data);
        }
      } catch {
        if (active) {
          setError(
            "Không thể tải danh sách sản phẩm. Hãy kiểm tra json-server đang chạy.",
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
  }, [searchParams]);

  const summary = useMemo(() => {
    if (loading) {
      return "Đang tải sản phẩm...";
    }

    if (products.length === 0) {
      return "Không tìm thấy sản phẩm phù hợp.";
    }

    return `Hiển thị ${products.length} sản phẩm`;
  }, [loading, products.length]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const keyword = searchInputRef.current?.value.trim() ?? "";

    if (!keyword) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: keyword });
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(10,10,10,0.88),rgba(32,20,10,0.68)),url('/images/products/8.jpg')] bg-cover bg-center text-white">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <p className="text-xs uppercase tracking-[0.45em] text-primary">
              Wine Collection
            </p>
            <h1
              className="mt-5 max-w-3xl text-5xl leading-none sm:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tất cả sản phẩm
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              Danh mục rượu vang tuyển chọn từ nhiều vùng nho nổi bật. Có thể
              tìm theo tên, quốc gia hoặc niên vụ.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 border border-border-soft bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.04)] lg:grid-cols-[1.4fr_auto] lg:items-end">
            <div>
              <SectionTitle
                title="Tìm sản phẩm phù hợp"
                subtitle="Nhập tên rượu, quốc gia hoặc niên vụ để lọc nhanh danh sách."
                center={false}
              />
            </div>

            <form
              key={query}
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label className="relative block min-w-70">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  ref={searchInputRef}
                  defaultValue={query}
                  placeholder="Ví dụ: Cabernet, Chile, 2014..."
                  className="w-full border border-border bg-surface py-4 pl-12 pr-4 text-sm outline-none transition focus:border-primary"
                />
              </label>
              <button className="bg-dark px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-dark-2">
                Tìm kiếm
              </button>
            </form>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-b border-border-soft pb-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>{summary}</p>
            <Link
              to="/"
              className="text-xs font-semibold uppercase tracking-[0.28em] text-primary"
            >
              Quay lại trang chủ
            </Link>
          </div>

          {error ? (
            <div className="mt-10 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-105 animate-pulse border border-border-soft bg-white"
                />
              ))}
            </div>
          ) : null}

          {!loading && !error ? (
            products.length > 0 ? (
              <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-10 border border-border-soft bg-white px-6 py-12 text-center">
                <h2
                  className="text-3xl text-dark"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Không có kết quả
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
                  Thử từ khóa khác ngắn hơn hoặc tìm theo quốc gia, ví dụ:
                  Argentina, Tây Ban Nha, Cabernet.
                </p>
              </div>
            )
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
