# AGENTS.md — e-commerce-clothing-app

## Quick Start
```bash
pnpm dev        # dev server at http://localhost:4321
pnpm build      # production build → dist/
pnpm astro check  # typecheck
```

## Architecture
- **Astro 7** static site + **React 19** islands (`client:load`)
- **Tailwind CSS v4** via Vite plugin (`@tailwindcss/vite`)
- **2-layer**: `src/lib/` (pure functions: data, cart, payment, contact) + `src/components/` (UI islands + shadcn/base-ui)
- `src/types/storefront.ts` — single source of truth for types + catalog constants
- No DI, no ports/adapters, no use-case layer (YAGNI)

## Key Files
| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Entry: renders `<StoreFrontIsland client:load />` (no props) |
| `src/components/storefront/store-front-island.tsx` | Client island: fetches via `lib/data.ts`, provides `CartProvider` |
| `src/lib/data.ts` | Mock data fetchers (`getCategories`, `getProductsByCategory`, `getHeroSlides`, `getContactImageUrl`, `getStorefrontData`) |
| `src/lib/cart.tsx` | `CartProvider`, `useCart`, `useCartActions` — localStorage direct |
| `src/lib/payment.ts` | `createPreference(cart)` — mock Mercado Pago |
| `src/lib/contact.ts` | `sendContact(values)` — console.log placeholder |
| `src/types/storefront.ts` | All types + `defaultCatalog` (4-axis product model) + utils |

## Product Model (4 axes)
`Category (caballero/dama) → Type (playera/buff/earcuffs) → Format (pocatepetl/mariposa/montañas) → Variant (S/M/L/unitalla/rojo/azul/verde/izquierdo/derecho)` — each combo = unique `Product` with own `id`/`price`.

## Cart Behavior
- `localStorage` key: `storefront.cart`
- Items keyed by `id` (product variant ID)
- Changing format/variant → `replace(itemId, resolvedProduct)` preserves quantity
- Format change preserves current variant if it exists in new format; else first variant of new format

## Cart Drawer (format/variant switching)
- `src/components/storefront/cart-drawer.tsx` → `CartItemRow` handles eje 3 (format) + eje 4 (variant) changes
- Local state (`format`, `axis4`) synced via `useEffect([item.id])` when parent item changes
- Click handlers use `queueMicrotask(() => handleChange(newFormat, newAxis4))` to avoid stale closures
- `handleChange` receives explicit params, finds resolved product, calls `replace(item.id, resolved)`
- // ponytail: local state may desync if parent pushes new item.id while drawer open. Upgrade: sync on `[item.id]`

## Dev Notes
- Node `>=22.12.0` (`.nvmrc`), TS strict, ES modules
- `astro check` for type validation
- `components.json` configures shadcn/base-ui (alias `@/components/ui`)
- Path alias `@/` → `src/`
- No tests yet

## Common Tasks
```bash
# Add product: edit mock data in src/lib/data.ts
# Add type/format/variant: update defaultCatalog in src/types/storefront.ts + mock data
# Change cart persistence: modify src/lib/cart.tsx (localStorage logic)
# Styling: Tailwind v4 in src/styles/globals.css (oklch tokens, dark mode via media query)
```

## Workspace Context (Plans)
> **Lee estos archivos para contexto completo del trabajo en progreso:**

| Plan | Archivo | Estado |
|------|---------|--------|
| **Plan 0** | `PLAN-00-github-pages.md` | Deploy GitHub Pages (repo privado, pages público) |
| **Plan 1** | `PLAN-01-supabase-multi-tenant.md` | Supabase Edge Functions + Multi-tenant (company_id + RLS) |
| **Plan 2** | `PLAN-02-mercadopago-integration.md` | Mercado Pago via Edge Functions |

## Auto-Update Rule
> **Este archivo + los 3 PLAN-XX.md deben actualizarse tras cada cambio arquitectural, nueva fase completada, o decisión técnica.** Cuando avances una tarea: marca `[x]` en el plan correspondiente, actualiza la sección relevante aquí, y verifica `pnpm build` pasa. Mantén minimalista — solo high-signal facts.