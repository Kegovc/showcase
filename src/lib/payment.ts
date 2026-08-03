import type { Cart, PaymentPreference } from "@/types/storefront";

export async function createPreference(cart: Cart): Promise<PaymentPreference> {
  const items = cart.items.map((item) => ({
    title: `${item.type} · ${item.format} · ${item.variant}`,
    unitPrice: item.price,
    quantity: item.quantity,
  }));
  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return {
    id: `mock_pref_${Date.now()}`,
    initPoint: "#pago-simulado",
    items,
    total,
  };
}