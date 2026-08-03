"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Cart, CartItem, Product, ProductVariant } from "@/types/storefront";
import { cartCount, cartTotal } from "@/types/storefront";

const STORAGE_KEY = "storefront.cart";

function readCart(): Cart {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as Cart;
    return Array.isArray(parsed.items) ? parsed : { items: [] };
  } catch {
    return { items: [] };
  }
}

function writeCart(cart: Cart): Cart {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }
  return cart;
}

interface CartContextValue {
  cart: Cart;
  count: number;
  total: number;
  add: (variant: ProductVariant) => Promise<void>;
  replace: (itemId: string, product: Product) => Promise<void>;
  setQuantity: (itemId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(readCart);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    setCart(readCart());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (variant: ProductVariant) => {
      const cart = readCart();
      const item: CartItem = {
        id: variant.id,
        category: variant.category,
        type: variant.type,
        format: variant.format,
        variant: variant.variant,
        price: variant.price,
        imageUrl: variant.imageUrl,
        quantity: 1,
      };
      const existing = cart.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push(item);
      }
      writeCart(cart);
      setCart(readCart());
      setOpen(true);
    },
    [],
  );

  const replace = useCallback(
    async (itemId: string, product: Product) => {
      const cart = readCart();
      const idx = cart.items.findIndex((i) => i.id === itemId);
      if (idx === -1) return;
      const quantity = cart.items[idx].quantity;
      cart.items[idx] = {
        id: product.id,
        category: product.category,
        type: product.type,
        format: product.format,
        variant: product.variant,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      };
      writeCart(cart);
      setCart(readCart());
    },
    [],
  );

  const clear = useCallback(async () => {
    writeCart({ items: [] });
    setCart(readCart());
  }, []);

  const setQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      const cart = readCart();
      const idx = cart.items.findIndex((i) => i.id === itemId);
      if (idx === -1) return;
      if (quantity <= 0) {
        cart.items.splice(idx, 1);
      } else {
        cart.items[idx] = { ...cart.items[idx], quantity };
      }
      writeCart(cart);
      setCart(readCart());
    },
    [],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cartCount(cart),
      total: cartTotal(cart),
      add,
      replace,
      setQuantity,
      clear,
      open,
      setOpen,
    }),
    [cart, add, replace, setQuantity, clear, open],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}

export function useCartActions() {
  const { add, replace, setQuantity, clear, open, setOpen, count, total } = useCart();
  return { add, replace, setQuantity, clear, open, setOpen, count, total };
}