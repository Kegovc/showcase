import type { Category } from "./product-variant"

export interface CartItem {
  /** id estable del item = variant.id */
  id: string
  category: Category
  type: string
  format: string
  variant: string
  price: number
  imageUrl: string
  quantity: number
}

export interface Cart {
  items: CartItem[]
}

export function cartTotal(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function cartCount(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}
