export type ProductCategorySlug = "vang-do" | "vang-trang" | "champagne";

export interface ProductCategoryConfig {
  slug: ProductCategorySlug;
  label: string;
  title: string;
  subtitle: string;
  heroImage: string;
  searchPlaceholder: string;
  categoryIds: number[];
}

export const productCategories: ProductCategoryConfig[] = [
  {
    slug: "vang-do",
    label: "Rượu vang đỏ",
    title: "Rượu Vang Đỏ",
    subtitle:
      "Các chai có cấu trúc đậm, hương trái cây chín và tầng vị phù hợp cho bàn tiệc tối hoặc những bữa ăn nhiều đạm.",
    heroImage: "/images/products/8.jpg",
    searchPlaceholder: "Tìm trong vang đỏ: Cabernet, Merlot, Chile...",
    categoryIds: [2],
  },
  {
    slug: "vang-trang",
    label: "Rượu trắng",
    title: "Rượu Vang Trắng",
    subtitle:
      "Nhóm vang trắng tươi mát với hương hoa quả và khoáng chất, phù hợp khai vị, hải sản và các buổi gặp mặt ban ngày.",
    heroImage: "/images/products/14.jpg",
    searchPlaceholder: "Tìm trong vang trắng: Sauvignon, Riesling...",
    categoryIds: [3],
  },
  {
    slug: "champagne",
    label: "Champagne",
    title: "Champagne & Cava",
    subtitle:
      "Bộ sưu tập sparkling cho dịp chúc mừng, nổi bật với bọt mịn, vị tươi sáng và hậu vị sạch.",
    heroImage: "/images/products/6.jpg",
    searchPlaceholder: "Tìm trong champagne: Cava, sparkling...",
    categoryIds: [6, 7],
  },
];

export function getProductCategory(slug: string) {
  return productCategories.find((category) => category.slug === slug) ?? null;
}
