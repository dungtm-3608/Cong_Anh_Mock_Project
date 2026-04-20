// src/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "../types/index.ts";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleSelect: (productId: number) => void;
  selectAll: (selected: boolean) => void;
  clearCart: () => void;
  // Computed values
  getSelectedItems: () => CartItem[];
  getTotalAmount: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                product,
                quantity,
                selected: true,
              },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        })),

      toggleSelect: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, selected: !i.selected } : i,
          ),
        })),

      selectAll: (selected) =>
        set((state) => ({
          items: state.items.map((i) => ({ ...i, selected })),
        })),

      clearCart: () => set({ items: [] }),

      getSelectedItems: () => get().items.filter((i) => i.selected),

      getTotalAmount: () =>
        get()
          .items.filter((i) => i.selected)
          .reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      getTotalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "cart-storage" },
  ),
);
