# PLAN-01: Supabase Multi-Tenant (1 Proyecto, company_id + RLS)

> **Objetivo**: Backend API en Supabase Edge Functions (Deno). Una DB, múltiples empresas aisladas via `company_id` + RLS. Backend en dominio Supabase (`https://<ref>.supabase.co/functions/v1/*`). Sin custom domains.

---

## Arquitectura

```
Frontend (GitHub Pages) → https://<ref>.supabase.co/functions/v1/*
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
             catalog API          cart API           orders API
             (Edge Fn)            (Edge Fn)          (Edge Fn)
                    │                 │                 │
                    └─────────────────┼─────────────────┘
                                      ▼
                              PostgreSQL + RLS
                              (company_id en todas las tablas)
```

---

## Phase 0: Foundation (Semana 1)

### 0.1 Crear proyecto Supabase
- [ ] 0.1.1 Nuevo proyecto → copiar Project Ref, Anon Key, Service Role Key
- [ ] 0.1.2 Settings → API → habilitar Edge Functions

### 0.2 Migraciones SQL (orden estricto)
```sql
-- 1. companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  custom_domain VARCHAR(200) UNIQUE,
  settings JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Añadir company_id a tablas existentes
ALTER TABLE categories ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE product_types ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE formats ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE variants ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE products ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE carts ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE orders ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE hero_slides ADD COLUMN company_id UUID REFERENCES companies(id);

-- 3. Índices compuestos
CREATE INDEX idx_products_company_category ON products(company_id, category_id);
CREATE INDEX idx_orders_company_status ON orders(company_id, status);
CREATE INDEX idx_carts_company_session ON carts(company_id, session_id);

-- 4. RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_by_company" ON categories
  FOR ALL USING (company_id = current_setting('app.current_company_id')::uuid);
-- Repetir para: product_types, formats, variants, products, carts, orders, hero_slides

-- 5. Seed empresa demo
INSERT INTO companies (slug, name, active) VALUES ('demo', 'Empresa Demo', true);
```

### 0.3 Secrets en Supabase Vault
| Secret | Valor |
|--------|-------|
| `MP_ACCESS_TOKEN` | `TEST-...` (sandbox) |
| `MP_WEBHOOK_SECRET` | `whsec_...` |
| `FRONTEND_URL` | `https://usuario.github.io/repo` |

### 0.4 Edge Function Health Check
- [ ] `supabase/functions/health/index.ts` → GET `/health` → `{ ok: true, company_id: "demo" }`
- [ ] Deploy: `supabase functions deploy health`

### 0.5 Frontend .env
```env
VITE_API_BASE=https://<project-ref>.supabase.co/functions/v1
VITE_COMPANY_ID=demo
```

---

## Phase 1: Catalog API
| Endpoint | Edge Function | Frontend |
|----------|---------------|----------|
| `GET /catalog/categories` | `catalog/categories` | `lib/data.ts` |
| `GET /catalog/products` | `catalog/products` | `lib/data.ts` |
| `GET /catalog/hero-slides` | `catalog/hero-slides` | `lib/data.ts` |

### Tasks
- [ ] 1.1 `catalog/categories` (GET, filtra por company_id)
- [ ] 1.2 `catalog/products` (GET, filtros category/type/format)
- [ ] 1.3 `catalog/hero-slides` (GET)
- [ ] 1.4 Migrar `src/lib/data.ts` → `fetch(\`${API_BASE}/catalog/...\`)`

---

## Phase 2: Cart API
| Endpoint | Edge Function | Frontend |
|----------|---------------|----------|
| `GET /cart` | `cart/get` | `lib/cart.tsx` |
| `POST /cart/items` | `cart/add` | `lib/cart.tsx` |
| `PATCH /cart/items/:id` | `cart/update` | `lib/cart.tsx` |
| `DELETE /cart/items/:id` | `cart/remove` | `lib/cart.tsx` |

### Tasks
- [ ] 2.1 `cart/get` (lee/crea carrito por session_id + company_id)
- [ ] 2.2 `cart/add` (agrega item, respeta stock)
- [ ] 2.3 `cart/update` (cantidad, valida stock)
- [ ] 2.4 `cart/remove` (elimina item)
- [ ] 2.5 Migrar `src/lib/cart.tsx` → API + localStorage fallback

---

## Phase 3: Orders API (Integra Plan 02)
- [ ] 3.1 `orders/create` (POST, crea orden pendiente)
- [ ] 3.2 `orders/get/:id` (GET, estado + items)
- [ ] 3.3 Integración Mercado Pago (ver Plan 02)

---

## Company Context (Shared)
```typescript
// _shared/company-context.ts
export async function getCompanyId(req: Request): Promise<string> {
  // 1. Header explícito
  const headerId = req.headers.get("X-Company-ID");
  if (headerId) return headerId;
  
  // 2. Subdominio (futuro)
  const host = req.headers.get("Host") || "";
  const subdomain = host.split(".")[0];
  if (subdomain && subdomain !== "www") {
    const { data } = await supabase
      .from("companies").select("id").eq("slug", subdomain).single();
    if (data) return data.id;
  }
  
  throw new Error("Company context required");
}
```

---

## Tasks & Progress
- [ ] Phase 0.1-0.5: Foundation
- [ ] Phase 1: Catalog API
- [ ] Phase 2: Cart API
- [ ] Phase 3: Orders + MP