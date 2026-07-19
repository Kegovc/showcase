import type { PaymentService, PaymentPreference } from "@/domain/ports"
import type { Cart } from "@/domain/models"
import { buildVariantName } from "@/domain/models"

export interface CreatePreferenceDeps {
  paymentService: PaymentService
}

// Construye el payload de items a partir de las variantes del carrito.
// El name se deriva de los 4 ejes vía buildVariantName (no se almacena).
export function cartToPreferenceItems(cart: Cart) {
  return cart.items.map((item) => ({
    title: `${item.type} · ${item.format} · ${item.variant}`,
    unitPrice: item.price,
    quantity: item.quantity,
  }))
}

export async function createPreference(
  deps: CreatePreferenceDeps,
  cart: Cart,
): Promise<PaymentPreference> {
  void buildVariantName
  return deps.paymentService.createPreference(cart)
}
