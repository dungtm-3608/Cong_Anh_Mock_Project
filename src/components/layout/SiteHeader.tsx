import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

interface SiteHeaderProps {
  showMegaMenu?: boolean;
}

const mainNav = [
  { label: "Trang chủ", to: "/" },
  { label: "Tất cả sản phẩm", to: "/san-pham" },
  { label: "Rượu vang đỏ", to: "/danh-muc/vang-do" },
  { label: "Rượu trắng", to: "/danh-muc/vang-trang" },
  { label: "Champagne", to: "/danh-muc/champagne" },
];

const megaMenuColumns = [
  {
    title: "Rượu vang đỏ",
    links: ["Bordeaux", "Shiraz", "Merlot", "Cabernet"],
  },
  {
    title: "Rượu trắng",
    links: ["Chardonnay", "Sauvignon", "Pinot Gris", "Moscato"],
  },
  {
    title: "Rượu sủi",
    links: ["Champagne", "Prosecco", "Cava", "Sparkling Rosé"],
  },
  {
    title: "Bộ sưu tập",
    links: ["Premium", "Best Seller", "Vintage", "Limited"],
  },
];

export default function SiteHeader({ showMegaMenu = false }: SiteHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartQuantity = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function toggleMobileMenu() {
    setIsMobileMenuOpen((currentState) => !currentState);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header>
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6 sm:py-6">
          <Link to="/" className="shrink-0">
            <div className="leading-none text-primary">
              <p
                className="text-3xl italic tracking-wide sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Wine house
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.42em] text-white/80 sm:text-xs sm:tracking-[0.5em]">
                Since 1980
              </p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 text-[11px] uppercase tracking-[0.28em] lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="transition hover:text-primary"
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <Link
                to="/don-hang"
                className="transition hover:text-primary"
              >
                Đơn hàng
              </Link>
            ) : null}

            <Link
              to="/gio-hang"
              className="inline-flex items-center gap-2 transition hover:text-primary"
            >
              Giỏ hàng
              {cartQuantity > 0 ? (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-white">
                  {cartQuantity}
                </span>
              ) : null}
            </Link>

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="cursor-pointer transition hover:text-primary"
              >
                Đăng xuất
              </button>
            ) : (
              <Link to="/dang-nhap" className="transition hover:text-primary">
                Đăng nhập
              </Link>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white transition hover:border-primary hover:text-primary"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-white/10 transition-all duration-300 lg:hidden ${
            isMobileMenuOpen ? "max-h-[80vh]" : "max-h-0"
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <nav className="flex flex-col border border-white/10 bg-white/4">
              {mainNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className="border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.28em] text-white transition last:border-b-0 hover:bg-white/8 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/gio-hang"
                onClick={closeMobileMenu}
                className="flex items-center justify-between border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.28em] text-white transition last:border-b-0 hover:bg-white/8 hover:text-primary"
              >
                <span>Giỏ hàng</span>
                {cartQuantity > 0 ? (
                  <span className="bg-primary px-2 py-1 text-[10px] text-white">
                    {cartQuantity}
                  </span>
                ) : null}
              </Link>
              {user ? (
                <Link
                  to="/don-hang"
                  onClick={closeMobileMenu}
                  className="border-b border-white/10 px-4 py-4 text-xs uppercase tracking-[0.28em] text-white transition last:border-b-0 hover:bg-white/8 hover:text-primary"
                >
                  Đơn hàng
                </Link>
              ) : null}
            </nav>

            <div className="mt-4 grid gap-3 border border-white/10 bg-white/4 p-4 text-xs uppercase tracking-[0.24em] text-white/75">
              {user ? (
                <>
                  <span>Xin chào, {user.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-fit text-left text-primary"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <Link to="/dang-nhap" onClick={closeMobileMenu} className="text-primary">
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMegaMenu && (
        <div className="border-b border-border-soft bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[180px_1fr]">
            <div className="hidden items-start justify-center lg:flex">
              <div className="relative">
                <img
                  src="/images/products/10.jpg"
                  alt="Grapes"
                  className="h-32 w-20 object-cover shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
                />
                <div className="absolute -bottom-3 -left-3 h-16 w-16 border border-primary/30" />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_240px]">
              {megaMenuColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-dark">
                    {column.title}
                  </h3>
                  <div className="mt-4 space-y-2 text-[11px] uppercase tracking-[0.14em] text-muted">
                    {column.links.map((link) => (
                      <p key={link}>{link}</p>
                    ))}
                  </div>
                </div>
              ))}

              <div className="overflow-hidden border border-border-soft">
                <img
                  src="/images/products/12.jpg"
                  alt="Featured vineyard"
                  className="h-28 w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-primary">
                    Wine Selection
                  </p>
                  <p
                    className="mt-2 text-2xl uppercase tracking-[0.14em]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Summer Harvest
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
