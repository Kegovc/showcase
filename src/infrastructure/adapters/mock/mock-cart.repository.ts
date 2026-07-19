import type { CartRepository } from "@/domain/ports"
import type { Cart, CartItem, ProductVariant } from "@/domain/models"

const STORAGE_KEY = "storefront.cart"

function read(): Cart {
  if (typeof localStorage === "undefined") return { items: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw) as Cart
    return Array.isArray(parsed.items) ? parsed : { items: [] }
  } catch {
    return { items: [] }
  }
}

function write(cart: Cart): Cart {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }
  return cart
}

export const mockCartRepository: CartRepository = {
  get: async () => read(),

  add: async (variant: ProductVariant) => {
    const cart = read()
    const item: CartItem = {
      id: variant.id,
      category: variant.category,
      type: variant.type,
      format: variant.format,
      variant: variant.variant,
      price: variant.price,
      imageUrl: variant.imageUrl,
      quantity: 1,
    }
    const existing = cart.items.find((i) => i.id === item.id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.items.push(item)
    }
    return write(cart)
  },

  clear: async () => write({ items: [] }),
}
