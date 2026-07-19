import type { PaymentService, PaymentPreference } from "@/domain/ports"
import type { Cart } from "@/domain/models"

// Adaptador mock: NO hace llamadas reales a Mercado Pago.
// Devuelve una preferencia simulada. El contrato (PaymentService) queda
// listo para enchufar el adaptador real de MP en una fase posterior.
export const mockPaymentService: PaymentService = {
  createPreference: async (cart: Cart): Promise<PaymentPreference> => {
    const items = cart.items.map((item) => ({
      title: `${item.type} · ${item.format} · ${item.variant}`,
      unitPrice: item.price,
      quantity: item.quantity,
    }))
    const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)

    return {
      id: `mock_pref_${Date.now()}`,
      initPoint: "#pago-simulado",
      items,
      total,
    }
  },
}
