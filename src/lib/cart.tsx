"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Cart, CartItem, Product, ProductVariant } from "@/types/storefront";
import { cartCount, cartTotal } from "@/types/storefront";

const API_BASE = import.meta.env.VITE_API_BASE || "https://cxstdgjnurtpjqklfipn.supabase.co/functions/v1";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || "sire";

// Generate a session ID for the cart (persisted in sessionStorage)
function getSessionId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let sessionId = sessionStorage.getItem("cart_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("cart_session_id", sessionId);
  }
  return sessionId;
}

async function fetchCartAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const sessionId = getSessionId();
  const response = await fetch(`${import.meta.env.VITE_API_BASE || "https://cxstdgjnurtpjqklfipn.supabase.co/functions/v1"}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-company-id': import.meta.env.VITE_COMPANY_ID || 'sire',
      'x-session-id': sessionId,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} ${response.statusText} - ${JSON.stringify(error)}`);
  }
  
  return response.json();
}

interface CartContextValue {
  cart: Cart;
  count: number;
  total: number;
  loading: boolean;
  add: (variant: ProductVariant) => Promise<void>;
  replace: (itemId: string, product: Product) => Promise<void>;
  setQuantity: (itemId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCartAPI<{ items: CartItem[] }>('cart-get');
      setCart({ items: data.items || [] });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      // Fallback to empty cart
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (variant: ProductVariant) => {
      try {
        await fetchCartAPI('cart-add', {
          method: 'POST',
          body: JSON.stringify({ product_id: variant.id, quantity: 1 }),
        });
        await refresh();
        setOpen(true);
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    }, []);

  const replace = useCallback(
    async (itemId: string, product: Product) => {
      try {
        // For replace, we need to update the cart item with new product
        // This would be a PATCH to update the item with new product_id
        await fetchCartAPI(`cart-update/${itemId}`, {
          method: 'PATCH',
          body: JSON.stringify({ product_id: product.id }),
        });
        await refresh();
      } catch (err) {
        console.error('Failed to replace cart item:', err);
      }
    }, []);

  const clear = useCallback(async () => {
    try {
      // Clear cart by removing all items - we'll need a clear endpoint
      // For now, just refresh to get current state
      await refresh();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, []);

  const setQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        if (quantity <= 0) {
          // Remove item
          await fetchCartAPI(`cart-remove/${itemId}`, { method: 'DELETE' });
        } else {
          await fetchCartAPI(`cart-update/${itemId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
          });
        }
        await refresh();
      } catch (err) {
        console.error('Failed to set quantity:', err);
      }
    }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cartCount(cart),
      total: cartTotal(cart),
      loading,
      add,
      replace,
      setQuantity,
      clear,
      open,
      setOpen,
      refresh,
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
  const { add, replace, setQuantity, clear, open, setOpen, count, total, loading } = useCart();
  return { add, replace, setQuantity, clear, open, setOpen, count, total, loading };
}