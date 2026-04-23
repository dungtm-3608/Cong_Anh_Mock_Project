import api from "./api";
import type { Product } from "../types";
import {
  getProductCategory,
  type ProductCategorySlug,
} from "../data/productCategories";

export async function getProducts(search?: string) {
  const response = await api.get<Product[]>("/products");
  const keyword = search?.trim().toLowerCase();

  if (!keyword) {
    return response.data;
  }

  return response.data.filter((product) => {
    const haystack = [
      product.name,
      product.country,
      product.description,
      product.year?.toString() ?? "",
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(keyword);
  });
}

export async function getFeaturedProducts(limit = 4) {
  const products = await getProducts();

  return [...products]
    .sort((first, second) => {
      const secondScore = second.rating * 10 + second.reviewCount;
      const firstScore = first.rating * 10 + first.reviewCount;

      return secondScore - firstScore;
    })
    .slice(0, limit);
}

export async function getProductBySlug(slug: string) {
  const response = await api.get<Product[]>("/products", {
    params: { slug },
  });

  return response.data[0] ?? null;
}

export async function getProductsByIds(productIds: string[]) {
  if (productIds.length === 0) {
    return [];
  }

  const products = await getProducts();
  const selectedIds = new Set(productIds);

  return products.filter((product) => selectedIds.has(product.id));
}

export async function updateProductStock(productId: string, stock: number) {
  const response = await api.patch<Product>(`/products/${productId}`, {
    stock,
  });

  return response.data;
}

export async function getProductsByCategory(categorySlug: ProductCategorySlug) {
  const category = getProductCategory(categorySlug);

  if (!category) {
    return [];
  }

  const products = await getProducts();

  return products.filter((product) =>
    category.categoryIds.includes(product.categoryId),
  );
}
