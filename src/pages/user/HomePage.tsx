import { Link } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import Button from "../../components/ui/Button";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useAuthStore } from "../../store/authStore";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);

  useDocumentTitle("Trang chủ");

  return (
    <div className="min-h-screen bg-(--color-surface)">
      <SiteHeader />

      <main className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6">
        <section className="w-full border border-(--color-border-soft) bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(17,17,17,0.03)] sm:px-10">
          <p className="text-xs uppercase tracking-[0.4em] text-(--color-primary)">
            Wine House
          </p>
          <h1
            className="mt-6 text-5xl uppercase tracking-[0.14em] text-(--color-dark) sm:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {user ? `Welcome ${user.name}` : "Welcome"}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-(--color-muted) sm:text-base">
            {user
              ? `Bạn đang đăng nhập với email ${user.email}.`
              : "Bạn chưa đăng nhập. Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục."}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {user ? null : (
              <>
                <Link to="/dang-nhap">
                  <Button variant="dark" size="lg">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/dang-ky">
                  <Button variant="outline" size="lg">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
