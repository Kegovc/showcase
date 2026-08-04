import type { Cart, PaymentPreference } from "@/types/storefront";

const API_BASE = import.meta.env.VITE_API_BASE || "https://cxstdgjnurtpjqklfipn.supabase.co/functions/v1";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || "sire";

async function fetchPaymentAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const sessionId = sessionStorage.getItem("cart_session_id") || crypto.randomUUID();
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-company-id': COMPANY_ID,
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

export async function createPreference(cart: Cart): Promise<PaymentPreference> {
  // First, we need to create an order with the cart items
  const sessionId = sessionStorage.getItem("cart_session_id") || crypto.randomUUID();
  
  // Create order
  const orderResponse = await fetch(`${API_BASE}/orders-create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-company-id': 'sire',
      'x-session-id': sessionId,
    },
    body: JSON.stringify({ session_id: sessionId }),
  });
  
  if (!orderResponse.ok) {
    const error = await orderResponse.json().catch(() => ({}));
    throw new Error(`Failed to create order: ${orderResponse.status} ${orderResponse.statusText}`);
  }
  
  const order = await orderResponse.json();
  
  // Create Mercado Pago preference
  const items = cart.items.map((item) => ({
    title: `${item.type} · ${item.format} · ${item.variant}`,
    unitPrice: item.price,
    quantity: item.quantity,
  }));
  
  const prefResponse = await fetch(`${API_BASE}/mp-preference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-company-id': 'sire',
      'x-session-id': sessionStorage.getItem("cart_session_id") || sessionId,
    },
    body: JSON.stringify({
      orderId: order.id,
      items: items.map(item => ({
        title: item.title,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
    }),
  });
  
  if (!prefResponse.ok) {
    const error = await prefResponse.json().catch(() => ({}));
    throw new Error(`Failed to create preference: ${prefResponse.status} ${prefResponse.statusText}`);
  }
  
  const preference = await prefResponse.json();
  
  return {
    id: preference.preference_id,
    initPoint: preference.init_point || preference.sandbox_init_point || "#pago-simulado",
    items: items.map(item => ({
      title: item.title,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
    total: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
  };
}