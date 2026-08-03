# PLAN-02: Mercado Pago Integration (Supabase Edge Functions)

> **Objetivo**: Pagos reales via MP. Backend: 2 Edge Functions (`mp/preference`, `mp/webhook`). Frontend: migrar `lib/payment.ts` mock → API real.

---

## Phase 0: MP Account Setup
- [ ] 0.1 Crear cuenta Mercado Pago México
- [ ] 0.2 Credenciales Sandbox (Public Key + Access Token)
- [ ] 0.3 Configurar webhook URL: `https://<ref>.supabase.co/functions/v1/mp/webhook`
- [ ] 0.4 Generar Webhook Secret (`whsec_...`)
- [ ] 0.5 Métodos: Tarjetas + Efectivo (OXXO/7-Eleven) + SPEI

---

## Phase 1: Edge Functions

### 1.1 `mp/preference` (POST)
```typescript
// Input: { orderId, items[], backUrls?, payer? }
// 1. Validar order existe y pertenece a company_id
// 2. POST https://api.mercadopago.com/checkout/preferences
// 3. Return { init_point, preference_id }
```

### 1.2 `mp/webhook` (POST)
```typescript
// 1. Verificar firma x-signature + x-request-id con webhookSecret
// 2. GET /v1/payments/{id} → payment completo
// 3. Idempotency: ¿ya procesamos este payment_id?
// 4. Buscar orden por external_reference
// 5. Guardar en tabla payments + actualizar orders.status
// 6. Si approved → limpiar cart
// 7. Return 200 OK
```

### Tasks
- [ ] 1.1 Deploy `mp/preference` con validación company_id
- [ ] 1.2 Deploy `mp/webhook` con verificación firma HMAC-SHA256
- [ ] 1.3 Tests unitarios con MP sandbox

---

## Phase 2: Frontend Integration
```typescript
// src/lib/payment.ts (migrar de mock)
export async function createPreference(cart: Cart): Promise<PaymentPreference> {
  // 1. POST /orders → crea orden pendiente
  // 2. POST /mp/preference → { init_point, preference_id }
  // 3. Return { initPoint, preferenceId }
}

// Polling en CartDrawer / página success
const pollPayment = async (orderId: string) => {
  for (let i = 0; i < 30; i++) {
    const res = await fetch(`/api/v1/orders/${orderId}`);
    const order = await res.json();
    if (order.status === "paid") return order;
    if (order.status === "rejected") throw new Error("Rechazado");
    await new Promise(r => setTimeout(r, 2000));
  }
};
```

### Tasks
- [ ] 2.1 Migrar `src/lib/payment.ts` → API real
- [ ] 2.2 Integrar polling en `CartDrawer` / página success
- [ ] 2.3 Manejo errores: rejected, pending, network error

---

## Phase 3: Payment Methods
- [ ] 3.1 Tarjetas (default, aprobado instantáneo)
- [ ] 3.2 Efectivo: OXXO / 7-Eleven (pending → webhook días después)
- [ ] 3.3 SPEI: transferencia (pending → webhook minutos)

---

## Phase 4: Producción
- [ ] 4.1 Cambiar a credenciales producción
- [ ] 4.2 Webhook URL producción
- [ ] 4.3 Test end-to-end $1 tarjeta real
- [ ] 4.4 Documentar disputas/chargebacks

---

## Testing Matrix
| Escenario | Método | Esperado |
|-----------|--------|----------|
| Happy path | Tarjeta aprobada | `approved` → orden `paid` |
| Rechazado | Tarjeta declinada | `rejected` → orden `rejected` |
| Pendiente | OXXO ticket | `pending` → webhook → `approved` |
| SPEI | Transferencia | `pending` → webhook → `approved` |
| Cancelado | Usuario cierra | `cancelled` |
| Reembolso | Partial/full | `refunded` |

---

## Tasks & Progress
- [ ] Phase 0: MP Account
- [ ] Phase 1: Edge Functions
- [ ] Phase 2: Frontend
- [ ] Phase 3: Methods
- [ ] Phase 4: Prod