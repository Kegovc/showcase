import type { Cart } from "../models"

export interface PaymentPreference {
  id: string
  /** URL a la que redirigir para pagar. En mock es simulada. */
  initPoint: string
  items: { title: string; unitPrice: number; quantity: number }[]
  total: number
}

export interface PaymentService {
  createPreference(cart: Cart): Promise<PaymentPreference>
}
