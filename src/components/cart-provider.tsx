"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  teamName: string;
  size: string;
  priceCents: number;
  quantity: number;
  maxStock: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "gala-soccer-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hidratação do localStorage precisa acontecer após o mount (SSR não tem
    // acesso a localStorage, e o primeiro render do client precisa bater com
    // o HTML do servidor antes de sincronizar o estado persistido).
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // localStorage indisponível ou dado corrompido — segue com carrinho vazio
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        const nextQty = Math.min(
          existing.quantity + quantity,
          existing.maxStock,
        );
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: nextQty } : i,
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, item.maxStock) }];
    });
  }

  function removeItem(variantId: string) {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }

  function updateQuantity(variantId: string, quantity: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.variantId === variantId
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }

  function clear() {
    setItems([]);
  }

  const { totalItems, subtotalCents } = useMemo(
    () => ({
      totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotalCents: items.reduce(
        (sum, i) => sum + i.priceCents * i.quantity,
        0,
      ),
    }),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        totalItems,
        subtotalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
