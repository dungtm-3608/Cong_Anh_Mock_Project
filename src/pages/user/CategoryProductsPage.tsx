import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ProductCard from "../../components/product/ProductCard";
import { getProductCategory } from "../../data/productCategories";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getProductsByCategory } from "../../services/products";
import type { Product } from "../../types";

export default function CategoryProductsPage() {
  const { categorySlug = "" } = useParams();
  const category = getProductCategory(categorySlug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle(category ? category.label : "Danh mục sản phẩm");

  useEffect(() => {
    if (!category) {
      return;
    }

    const activeCategory = category;
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await getProductsByCategory(activeCategory.slug);

        if (active) {
          setProducts(data);
        }
      } catch {
        if (active) {
          setError(
            "Không thể tải danh mục sản phẩm. Hãy kiểm tra json-server đang chạy.",
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
  }, [category]);

  const summary = useMemo(() => {
    if (!category) {
      return "";
    }

    if (loading) {
      return `Đang tải ${category.label.toLowerCase()}...`;
    }

    if (products.length === 0) {
      return `Không có sản phẩm trong ${category.label.toLowerCase()}.`;
    }

    return `${category.label}: ${products.length} sản phẩm`;
  }, [category, loading, products.length]);

  if (!category) {
    return <Navigate to="/san-pham" replace />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main>
        <section
          className="relative overflow-hidden bg-cover bg-center text-white"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(10, 10, 10, 0.88), rgba(32, 20, 10, 0.62)), url('${category.heroImage}')`,
          }}
        >
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <p className="text-xs uppercase tracking-[0.45em] text-primary">
              Wine Category
            </p>
            <h1
              className="mt-5 max-w-3xl text-5xl leading-none sm:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {category.title}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              {category.subtitle}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="border-b border-border-soft pb-5 text-sm text-muted">
            <p>{summary}</p>
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
                  Không có sản phẩm
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
                  Quay về danh sách tất cả sản phẩm để khám phá thêm các nhóm
                  rượu khác.
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
