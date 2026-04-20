import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

interface SiteHeaderProps {
  showMegaMenu?: boolean;
}

const topLinks = ["Bộ sưu tập mới", "Ưu đãi thành viên", "Tin tức rượu vang"];

const mainNav = [
  { label: "Trang chủ", to: "/" },
  { label: "Rượu vang đỏ" },
  { label: "Rượu trắng" },
  { label: "Champagne" },
  { label: "Thông tin" },
  { label: "Blog" },
  { label: "Liên hệ" },
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

  return (
    <header>
      <div className="border-b border-(--color-border-soft) bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-(--color-muted) sm:px-6">
          <div className="hidden flex-wrap items-center gap-3 md:flex">
            {topLinks.map((item) => (
              <span key={item} className="flex items-center gap-3">
                <span>{item}</span>
                <span className="last:hidden text-(--color-border)">|</span>
              </span>
            ))}
            {user ? (
              <>
                <span className="text-(--color-dark)">Xin chào, {user.name}</span>
                <button
                  onClick={logout}
                  className="text-(--color-dark) transition hover:text-black"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/dang-nhap" className="text-(--color-dark)">
                  Đăng nhập
                </Link>
                <Link to="/dang-ky" className="text-(--color-dark)">
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline">Tìm kiếm ở đây...</span>
            <Search size={12} />
          </div>
        </div>
      </div>

      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-10 px-4 py-6 sm:px-6">
          <Link to="/" className="shrink-0">
            <div className="leading-none text-(--color-primary)">
              <p
                className="text-4xl italic tracking-wide"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Wine house
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.5em] text-white/80">
                Since 1980
              </p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 text-[11px] uppercase tracking-[0.28em] lg:flex">
            {mainNav.map((item) => (
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="transition hover:text-(--color-primary)"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className="cursor-default transition hover:text-(--color-primary)"
                >
                  {item.label}
                </span>
              )
            ))}
          </nav>
        </div>
      </div>

      {showMegaMenu && (
        <div className="border-b border-(--color-border-soft) bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[180px_1fr]">
            <div className="hidden items-start justify-center lg:flex">
              <div className="relative">
                <img
                  src="/images/products/10.jpg"
                  alt="Grapes"
                  className="h-32 w-20 object-cover shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
                />
                <div className="absolute -bottom-3 -left-3 h-16 w-16 border border-(--color-primary)/30" />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_240px]">
              {megaMenuColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-dark)">
                    {column.title}
                  </h3>
                  <div className="mt-4 space-y-2 text-[11px] uppercase tracking-[0.14em] text-(--color-muted)">
                    {column.links.map((link) => (
                      <p key={link}>{link}</p>
                    ))}
                  </div>
                </div>
              ))}

              <div className="overflow-hidden border border-(--color-border-soft)">
                <img
                  src="/images/products/12.jpg"
                  alt="Featured vineyard"
                  className="h-28 w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-(--color-primary)">
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
