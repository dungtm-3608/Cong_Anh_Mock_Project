import { Link } from "react-router-dom";
import type { Product } from "../../types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price);
}

function getTagLabel(product: Product) {
  if (product.tags.includes("hot")) {
    return "Hot";
  }

  if (product.tags.includes("new")) {
    return "New";
  }

  return product.year ? `${product.year}` : null;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const tag = getTagLabel(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-(--color-border-soft) bg-white shadow-[0_18px_40px_rgba(18,18,18,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(18,18,18,0.1)]">
      <Link
        to={`/san-pham/${product.slug}`}
        className="relative block overflow-hidden bg-[#f7f4ee]"
      >
        {tag ? (
          <span className="absolute left-4 top-4 z-10 bg-(--color-primary) px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
            {tag}
          </span>
        ) : null}
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-72 w-full object-contain px-10 py-8 transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-(--color-muted)">
          {product.country}
        </p>
        <Link to={`/san-pham/${product.slug}`} className="mt-3">
          <h3
            className="text-2xl leading-tight text-(--color-dark) transition group-hover:text-(--color-primary)"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.name}
          </h3>
        </Link>
        <p className="mt-3 text-sm leading-6 text-(--color-muted) line-clamp-3">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-center gap-3">
          <span className="text-2xl font-semibold text-(--color-price)">
            {formatPrice(product.price)}đ
          </span>
          {product.originalPrice ? (
            <span className="text-sm text-(--color-muted) line-through">
              {formatPrice(product.originalPrice)}đ
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 border-t border-(--color-border-soft) pt-4 text-[10px] uppercase tracking-[0.2em] text-(--color-muted)">
          <span>{product.volume}</span>
          <span className="h-1 w-1 rounded-full bg-(--color-primary)" />
          <span>{product.alcohol}</span>
        </div>
      </div>
    </article>
  );
}
