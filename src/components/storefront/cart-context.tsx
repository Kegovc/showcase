"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { addToCart, getCart } from "@/application/use-cases"
import { createContainer } from "@/infrastructure/di/container"
import { cartCount, cartTotal } from "@/domain/models"
import type { Cart, ProductVariant } from "@/domain/models"

interface CartContextValue {
  cart: Cart
  count: number
  total: number
  add: (variant: ProductVariant) => Promise<void>
  clear: () => Promise<void>
  open: boolean
  setOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const container = createContainer()

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [] })
  const [open, setOpen] = useState(false)

  const refresh = useCallback(async () => {
    setCart(await getCart({ cartRepository: container.cartRepository }))
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const add = useCallback(
    async (variant: ProductVariant) => {
      await addToCart({ cartRepository: container.cartRepository }, variant)
      await refresh()
      setOpen(true)
    },
    [refresh],
  )

  const clear = useCallback(async () => {
    await container.cartRepository.clear()
    await refresh()
  }, [refresh])

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cartCount(cart),
      total: cartTotal(cart),
      add,
      clear,
      open,
      setOpen,
    }),
    [cart, add, clear, open],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>")
  return ctx
}
