"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

// MOCK DATA – Cart state uses Zustand persist (localStorage)
// Replace addItem/removeItem calls with API calls when backend is ready

function computeTotals(items: CartItem[]) {
  return {
    totalItems: items.reduce((sum, item) => sum + item.soLuong, 0),
    totalPrice: items.reduce((sum, item) => sum + item.gia * item.soLuong, 0),
  };
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (bienTheId: string) => void;
  updateQuantity: (bienTheId: string, quantity: number) => void;
  setCouponCode: (code: string | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      couponCode: null,
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.bienTheId === item.bienTheId
          );
          const nextItems = existing
            ? state.items.map((i) =>
                i.bienTheId === item.bienTheId
                  ? {
                      ...i,
                      soLuong: Math.min(
                        i.soLuong + item.soLuong,
                        i.soLuongTon
                      ),
                    }
                  : i
              )
            : [...state.items, item];
          return {
            items: nextItems,
            ...computeTotals(nextItems),
          };
        });
      },

      removeItem: (bienTheId) => {
        set((state) => {
          const nextItems = state.items.filter(
            (i) => i.bienTheId !== bienTheId
          );
          return {
            items: nextItems,
            ...computeTotals(nextItems),
          };
        });
      },

      updateQuantity: (bienTheId, quantity) => {
        set((state) => {
          const nextItems = state.items
            .map((i) =>
              i.bienTheId === bienTheId
                ? { ...i, soLuong: Math.min(quantity, i.soLuongTon) }
                : i
            )
            .filter((i) => i.soLuong > 0);
          return {
            items: nextItems,
            ...computeTotals(nextItems),
          };
        });
      },

      setCouponCode: (code) => set({ couponCode: code }),

      clearCart: () =>
        set({
          items: [],
          couponCode: null,
          totalItems: 0,
          totalPrice: 0,
        }),
    }),
    {
      name: "sportzone-cart",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const totals = computeTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalPrice = totals.totalPrice;
        }
      },
    }
  )
);
