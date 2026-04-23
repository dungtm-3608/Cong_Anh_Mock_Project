import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types";

interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  removeItems: (productIds: string[]) => void;
  clear: () => void;
}

function normalizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);
          const nextQuantity = normalizeQuantity(quantity);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + nextQuantity }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId,
                quantity: nextQuantity,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: normalizeQuantity(quantity) }
              : item,
          ),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      removeItems: (productIds) =>
        set((state) => ({
          items: state.items.filter((item) => !productIds.includes(item.productId)),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "wine-cart-storage",
    },
  ),
);
