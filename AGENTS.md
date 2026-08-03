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