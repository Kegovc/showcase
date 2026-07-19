import type { Cart } from "../models"
import type { ProductVariant } from "../models"

export interface CartRepository {
  get(): Promise<Cart>
  /** Agrega una variante al carrito (incrementa cantidad si ya existe). */
  add(variant: ProductVariant): Promise<Cart>
  clear(): Promise<Cart>
}
