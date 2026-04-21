import { ArrowLeft, ArrowRight, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ProductCard from "../../components/product/ProductCard";
import SectionTitle from "../../components/ui/SectionTitle";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getFeaturedProducts, getProducts } from "../../services/products";
import { useAuthStore } from "../../store/authStore";
import type { Product } from "../../types";

const galleryImages = [
  "/images/products/8.jpg",
  "/images/products/12.jpg",
  "/images/products/14.jpg",
  "/images/products/9.jpg",
  "/images/products/3.jpg",
  "/images/products/10.jpg",
];

const heroCategories = [
  {
    id: "vang-do",
    eyebrow: "Since 1980",
    titleTop: "Rượu",
    titleAccent: "Vang Đỏ",
    description:
      "Nhóm rượu cấu trúc đậm, phù hợp tiệc tối và pairing cùng thịt đỏ. Tập trung các chai Merlot, Cabernet và blend nổi bật.",
    backgroundImage: "/images/products/8.jpg",
    bottleImage: "/images/products/11.jpg",
    bottleName: "Red Selection",
    href: "/danh-muc/vang-do",
  },
  {
    id: "vang-trang",
    eyebrow: "Fresh vineyard",
    titleTop: "Rượu",
    titleAccent: "Vang Trắng",
    description:
      "Phong cách tươi mát, hương hoa quả và khoáng chất sáng. Phù hợp khai vị, hải sản và những bữa tiệc nhẹ ban ngày.",
    backgroundImage: "/images/products/14.jpg",
    bottleImage: "/images/products/1.jpg",
    bottleName: "White Selection",
    href: "/danh-muc/vang-trang",
  },
  {
    id: "champagne",
    eyebrow: "Celebration line",
    titleTop: "Rượu",
    titleAccent: "Sủi & Cava",
    description:
      "Các dòng sparkling và cava cho dịp chúc mừng, có độ tươi và bọt mịn. Hợp cho tiệc khai màn và những set quà nổi bật.",
    backgroundImage: "/images/products/6.jpg",
    bottleImage: "/images/products/4.jpg",
    bottleName: "Sparkling Selection",
    href: "/danh-muc/champagne",
  },
];

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const activeHero = heroCategories[activeHeroIndex];

  useDocumentTitle("Trang chủ");

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      try {
        const [featured, allProducts] = await Promise.all([
          getFeaturedProducts(4),
          getProducts(),
        ]);

        if (!active) {
          return;
        }

        setFeaturedProducts(featured);
        setBestSellerProducts(
          [...allProducts]
            .sort((first, second) => second.reviewCount - first.reviewCount)
            .slice(0, 4),
        );
      } catch {
        if (active) {
          setFeaturedProducts([]);
          setBestSellerProducts([]);
        }
      }
    }

    void loadHomeData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroIndex(
        (currentIndex) => (currentIndex + 1) % heroCategories.length,
      );
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  function showPreviousHero() {
    setActiveHeroIndex(
      (currentIndex) =>
        (currentIndex - 1 + heroCategories.length) % heroCategories.length,
    );
  }

  function showNextHero() {
    setActiveHeroIndex(
      (currentIndex) => (currentIndex + 1) % heroCategories.length,
    );
  }

  return (
    <div className="min-h-screen bg-(--color-surface)">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden bg-black text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85 transition-all duration-700"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.74), rgba(0, 0, 0, 0.28)), url('${activeHero.backgroundImage}')`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%)]" />

          <div className="relative mx-auto grid min-h-[680px] max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-(--color-primary)">
                {activeHero.eyebrow}
              </p>
              <h1
                className="mt-6 max-w-3xl text-6xl leading-[0.9] sm:text-7xl lg:text-[7.5rem]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {activeHero.titleTop}
                <span className="block text-(--color-primary)">
                  {activeHero.titleAccent}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
                {activeHero.description}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to={activeHero.href}
                  className="inline-flex items-center gap-2 bg-(--color-primary) px-8 py-4 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--color-primary-hover)"
                >
                  Xem category
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={showPreviousHero}
                    className="inline-flex h-11 w-11 items-center justify-center border border-white/20 bg-white/10 transition hover:border-(--color-primary) hover:text-(--color-primary)"
                    aria-label="Banner trước"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextHero}
                    className="inline-flex h-11 w-11 items-center justify-center border border-white/20 bg-white/10 transition hover:border-(--color-primary) hover:text-(--color-primary)"
                    aria-label="Banner tiếp theo"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {heroCategories.map((category, index) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveHeroIndex(index)}
                      className="group flex items-center gap-3"
                      aria-label={`Chọn ${category.titleAccent}`}
                    >
                      <span
                        className={`h-px transition-all ${
                          index === activeHeroIndex
                            ? "w-10 bg-(--color-primary)"
                            : "w-6 bg-white/35 group-hover:bg-white/60"
                        }`}
                      />
                      <span
                        className={`hidden text-[10px] uppercase tracking-[0.28em] sm:inline ${
                          index === activeHeroIndex
                            ? "text-white"
                            : "text-white/45"
                        }`}
                      >
                        {category.titleAccent}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="justify-self-end">
              <div className="border border-white/15 bg-white/8 p-5 backdrop-blur-sm">
                <img
                  src={activeHero.bottleImage}
                  alt={activeHero.bottleName}
                  className="h-[460px] w-full object-contain transition duration-500"
                />
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.36em] text-(--color-primary)">
                    Featured bottle
                  </p>
                  <p
                    className="mt-2 text-3xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {activeHero.bottleName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white">
          <div className="absolute left-0 top-0 hidden h-48 w-48 bg-[radial-gradient(circle,rgba(201,160,71,0.16),transparent_70%)] lg:block" />
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[220px_1fr]">
            <div className="hidden lg:block">
              <img
                src="/images/products/7.jpg"
                alt="Decorative grapes"
                className="h-80 w-full object-cover shadow-[0_24px_50px_rgba(19,18,17,0.14)]"
              />
            </div>

            <div className="text-center lg:text-left">
              <SectionTitle
                title="Giới thiệu"
                subtitle="Bộ sưu tập mới lấy cảm hứng từ mẫu winery cổ điển: hero lớn, khoảng thở rộng, sản phẩm nổi bật và lối duyệt đơn giản hơn cho người dùng."
                center={false}
              />
              <p className="max-w-3xl text-sm leading-8 text-(--color-muted)">
                {user
                  ? `Hiện bạn đang đăng nhập với ${user.email}. Bạn có thể chuyển thẳng sang danh sách sản phẩm để xem toàn bộ catalogue hoặc mở chi tiết từng chai.`
                  : "Trang chủ mới ưu tiên trải nghiệm khám phá rượu. Từ đây người dùng có thể vào danh sách tất cả sản phẩm, tìm kiếm nhanh và xem chi tiết từng chai chỉ với một lần click."}
              </p>

              <Link
                to="/san-pham"
                className="mt-8 inline-flex items-center gap-2 bg-(--color-dark) px-7 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-(--color-dark-2)"
              >
                Xem thêm
                <MoveRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="overflow-hidden bg-[linear-gradient(120deg,rgba(40,49,14,0.88),rgba(139,157,34,0.4)),url('/images/products/14.jpg')] bg-cover bg-center p-6 sm:p-10">
            <div className="grid gap-10 bg-white/92 p-8 backdrop-blur-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
              <div className="flex items-center justify-center bg-[#f9f6f1] p-6">
                <img
                  src="/images/products/14.jpg"
                  alt="Alpataco Sauvignon Blanc Patagonia"
                  className="h-[420px] w-full object-contain"
                />
              </div>

              <div className="self-center">
                <p className="text-[10px] uppercase tracking-[0.35em] text-(--color-primary)">
                  Chai nổi bật
                </p>
                <h2
                  className="mt-4 text-5xl leading-none text-(--color-dark)"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Sauvignon Blanc Patagonia
                </h2>
                <p className="mt-6 text-3xl font-semibold text-(--color-price)">
                  550.000đ
                </p>
                <p className="mt-6 text-sm leading-8 text-(--color-muted)">
                  Vang trắng phong cách mát lạnh với hương chanh leo, bưởi và
                  thảo mộc xanh. Section này tái hiện khối sản phẩm nổi của
                  design mẫu, nhưng dùng ảnh thật đang có trong project để giữ
                  trải nghiệm đồng nhất.
                </p>
                <div className="mt-8 grid gap-px overflow-hidden border border-(--color-border-soft) bg-(--color-border-soft) sm:grid-cols-2">
                  {[
                    { label: "334", value: "Ngày" },
                    { label: "26", value: "Giải" },
                    { label: "60", value: "Sản phẩm" },
                    { label: "15", value: "Năm" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white px-5 py-6 text-center"
                    >
                      <p className="text-3xl text-(--color-primary)">
                        {item.label}
                      </p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-(--color-muted)">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionTitle
            title="Sản phẩm mới"
            subtitle="Các chai nổi bật được kéo lên đầu để người dùng vào detail nhanh hơn."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {galleryImages.map((image, index) => (
            <div key={image} className="relative overflow-hidden">
              <img
                src={image}
                alt={`Wine gallery ${index + 1}`}
                className="h-56 w-full object-cover transition duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionTitle
            title="Sản phẩm bán chạy"
            subtitle="Danh sách này dẫn thẳng sang trang detail khi click vào từng sản phẩm."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
