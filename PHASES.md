# Historial de Fases — e-commerce-clothing-app

> Documento vivo: registra lo completado, decisiones técnicas y trabajo pendiente.
> Actualizar tras cada cambio arquitectural o fase completada.

---

## ✅ Fases Completadas

### Fase 0 — Migración Next.js → Astro
- Eliminados `next.config.mjs`, `postcss.config.mjs`, `app/`
- Creados `astro.config.mjs`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/components/storefront/store-front-island.tsx`
- Tailwind v4 vía Vite (`@tailwindcss/vite`)
- Fuentes Geist por Google Fonts `<link>`
- `lang="es"` en HTML

### Fase 1 — Configuración base y calidad
- `tsconfig.json` (extiende `astro/tsconfigs/strict`, alias `@/*` → `./src/*`)
- `.gitignore` (ignora `dist/`, `.astro/`)
- `README.md` real
- Limpieza de tipos (`React.SyntheticEvent<HTMLFormElement>`, sin `index` en `.map`)
- `astro check` → 0/0/0

### Fase 2 — Dominio + Aplicación (Hexagonal core)
**Dominio / Modelos**
- `src/domain/models/` → `category.ts`, `hero-slide.ts`, `product.ts`, `product-variant.ts`, `contact.ts`, `cart.ts`, `product-catalog.ts`

**Dominio / Puertos**
- `src/domain/ports/` → `category.repository.ts`, `hero.repository.ts`, `product.repository.ts`, `contact.service.ts`, `cart.repository.ts`, `payment.service.ts`

**Aplicación / Casos de uso**
- `src/application/use-cases/` → `get-storefront-data.ts`, `submit-contact.ts`, `cart/add-to-cart.ts`, `cart/get-cart.ts`, `cart/update-cart-item.ts`, `cart/set-cart-item-quantity.ts`, `payment/create-preference.ts`

### Fase 3 — Infraestructura Mock + DI
- `src/infrastructure/data/mock-data.ts` (datos de prueba)
- `src/infrastructure/adapters/mock/` → adaptadores para cada puerto
- `src/infrastructure/di/container.ts` → `createContainer()` resuelve todos los puertos a mocks

### Fase 4 — Carrito (localStorage) + Contacto Mock UI
**Modelo 4 ejes consolidado**
- `Product` = combinación concreta de 4 ejes (category, type, format, variant) con `id`/`price` propios
- `buildVariantName(v)` → `"caballero · playera · pocatepetl · mediana"`
- `Category` = `"caballero" | "dama"`
- `CategoryRecord` = `{id, name, kind}` para tabs

**Catálogo**
- `defaultCatalog.axis4Labels` (playera/shorts→Talla, buff→Color, earcuffs→Lado)
- `defaultCatalog.axis4Values` por type
- `axis4LabelFor(type)`

**Carrito**
- `CartItem` hereda 4 ejes + `quantity`
- `localStorage` key: `storefront.cart`
- Items keyed by `id` (product variant ID)
- Cambio formato/variante → `replace(itemId, resolvedProduct)` preserva cantidad
- Drawer = configurador (ejes 3/4) + lista de carrito
- Contacto mock con feedback UI real

### Fase 5 — Pago Simulado (Mercado Pago Mock)
- `payment.service.ts` → `createPreference(cart)` mock
- `mock-payment.service.ts` → adaptador
- Cableado en `cart-drawer.tsx` (botón "Pagar simulado")

### Fase 6 — SEO / Sitemap / Robots / Meta
- `@astrojs/sitemap` instalado
- `astro.config.mjs` con `site: 'https://tienda-ejemplo.com'` + integración sitemap
- `src/pages/robots.txt.ts` genera `robots.txt` con sitemap
- Meta OG/Twitter en `Layout.astro`
- Build genera `robots.txt`, `sitemap-index.xml`

### Correcciones Post-Fase 6 (Iteraciones)
1. **Modelo Product unificado** — `Product` = combinación 4 ejes (sin `variants`/`formats` anidados). `mockProductsByCategory` lista plana por combinación con `id`/`price` propios. Eliminados `product-modal.tsx` y `product-card.tsx`.
2. **Drawer configurador** — `product-row.tsx` tarjetas minimalistas con `onPick`; `cart-context.tsx` con `editing`/`openWith`/`closeEditor`; `cart-drawer.tsx` con `ProductEditor` (ejes 3/4) + sección carrito; `store-front-island.tsx` pasa `allProducts` y `onPickProduct={openWith}`.
3. **Selectores por item en carrito** — Eliminado `ProductEditor` aparte. Cada `CartItemRow` en `cart.items.map` muestra chips de eje 3 (formato) y eje 4 (talla/color/lado) con `replace(item.id, resolved)`. Tarjetas carrusel agregan directo (`onAdd`).
4. **Edición de cantidad** — Controles `− [input] +` y basura (`setQuantity`) en cada item.
5. **Heurística familia robusta** — `family = allProducts.filter(p => p.category === item.category && p.type === item.type)` (sin `baseNameOf`/regex). Habilita cambiar eje 3 (montañas/mariposa/pocatepetl) correctamente.
6. **Carrusel por tipo (eje 2)** — `store-front.tsx` renderiza un `ProductRow` por cada `type` en `defaultCatalog.types` (Playeras, Shorts, Buffs, Earcuffs) filtrando productos de la categoría activa.

---

## 🔄 FASE 7 — Cierre Arquitectura Hexagonal (Pendiente)

> Objetivo: eliminar acoplamientos residuales y documentar el contrato hexagonal antes de pruebas.

### 7.1 Unificar contenedor en cliente (DI único)
**Problema**: 3 instancias `createContainer()` a nivel módulo:
- `store-front-island.tsx`
- `cart-drawer.tsx`
- `cart-context.tsx`

**Solución**: `StoreFrontIsland` crea **una sola vez** `createContainer()` y lo pasa por props:
- `CartProvider` recibe `container` (prop) en lugar de crearlo
- `CartDrawer` recibe `container` o casos de uso/puertos necesarios (`paymentService`)

### 7.2 Separar storage del contexto React
**Problema**: `cart-context.tsx` tiene `readInitialCart()` leyendo `localStorage` directo (mezcla infra con presentación).

**Solución**: 
- Opción A (recomendada): `CartStorage` adapter dedicado que encapsula `localStorage`; el contexto usa `getCart({ cartRepository })` para estado inicial.
- Opción B: estado inicial vacío + `useEffect` hidrata vía `getCart` (parpadeo breve "vacío→lleno").

### 7.3 Documentar contrato hexagonal
- Comentario en `container.ts` (no crear docs nuevos):
  - Dónde inyectar proveedores reales (Supabase/Mercado Pago) post-Fase 6
  - Qué puertos implementar sin tocar dominio/casos de uso/UI

### 7.4 Verificación Fase 7
- `astro check` 0/0/0 + `pnpm build`
- Comportamiento: carrito hidrata desde `localStorage` (vía repo), selectores ejes 3/4 y cantidad funcionan

---

## 🧪 FASE 8 — Pruebas Automatizadas (Pendiente)

> Stack: **Vitest + jsdom** (encaja con Vite/Astro, soporta TS + alias `@/*`)

### 8.0 Setup
- DevDeps: `vitest`, `jsdom` (o `happy-dom`)
- Scripts: `test`, `test:watch`
- `vitest.config.ts` con `resolve.alias` `@` → `src` y `environment: "jsdom"`

### 8.1 Unitarias (dominio + casos de uso con stubs)
| Módulo | Qué probar |
|--------|------------|
| `product-variant.buildVariantName` | 4 ejes unidos con `" · "`; combinaciones distintas → nombres distintos |
| `cart.cartTotal` / `cart.cartCount` | Sumas con cantidades; vacío = 0 |
| `product-catalog.axis4LabelFor` | playera/shorts→Talla, buff→Color, earcuffs→Lado, default Variante |
| `getCart` / `updateCartItem` / `setCartItemQuantity` / `createPreference` / `submitContact` / `getStorefrontData` | Con **stubs de puertos** (no mock infra): orquestación y argumentos correctos. `cartToPreferenceItems` mapea `type·format·variant`, `unitPrice`, `quantity` |

### 8.2 Integración (casos de uso + adaptadores mock reales)
**Flujo carrito** (`mockCartRepository` + `localStorage` jsdom):
- add 2 variantes distintas → 2 items
- add **misma variante 2 veces** → 1 item, `quantity: 2` (merge)
- `setQuantity(id, 0)` → item eliminado
- `setQuantity(id, 5)` → cantidad actualizada
- `replace(itemId, productHermano)` → cambia `id`/precio conservando cantidad (cubre ejes 3/4)
- `clear()` → vacío
- `cartTotal`/`cartCount` coherentes

**`createPreference`** vs `mockPaymentService`:
- `items` con títulos `type·format·variant`, `total` = Σ(precio×cantidad), `id` con prefijo `mock_pref_`

**`submitContact`** vs `mockContactService`:
- `send` invocado con `ContactFormValues`

**`getStorefrontData`** vs mocks:
- `categories`, `productsByCategory` agrupado, `heroSlides`, `contactImageUrl`

**`createContainer()`**:
- Resuelve todos los puertos sin `undefined` (test cableado DI)

### 8.3 Alcance UI
Solo lógica (dominio + casos de uso + adaptadores). **Sin React Testing Library** en Fase 8.

---

## 📌 Decisiones Técnicas Clave (Registro)

| Tema | Decisión | Archivo/Ubicación |
|------|----------|-------------------|
| Modelo producto | `Product` = 4 ejes resueltos (sin anidación) | `src/domain/models/product.ts` |
| Nombre variante | `buildVariantName` une 4 ejes con `" · "` | `src/domain/models/product-variant.ts` |
| Catálogo ejes | `defaultCatalog.axis4Labels/Values` por `type` | `src/domain/models/product-catalog.ts` |
| Carrito persistencia | `localStorage` key `storefront.cart` | `src/infrastructure/adapters/mock/mock-cart.repository.ts` |
| Cambio combinación | `replace(itemId, product)` conserva `quantity` | `cart.repository.ts` puerto + mock |
| Selectores ejes 3/4 | **Dentro de cada item** del carrito (no modal aparte) | `src/components/storefront/cart-drawer.tsx` |
| Heurística familia | `category` + `type` (sin nombre/regex) | `CartItemRow` en `cart-drawer.tsx` |
| Carrusel productos | **Uno por `type` (eje 2)** en orden catálogo | `src/components/storefront/store-front.tsx` |
| Container DI | Unificado en cliente (Fase 7) | `container.ts` + `store-front-island.tsx` |

---

## 🚀 Próximos Pasos Inmediatos

1. **Ejecutar Fase 7** (al volver del trabajo manual):
   - Unificar container en cliente
   - Separar `localStorage` del contexto (adapter `CartStorage`)
   - Documentar en `container.ts`
   - Verificar `astro check` + `pnpm build`

2. **Ejecutar Fase 8**:
   - Instalar Vitest + jsdom
   - Escribir tests unitarias + integración según tabla arriba
   - CI: `pnpm test` en pipeline

---

## 📝 Notas de Trabajo Manual (Usuario)

> Espacio para registrar cambios hechos a mano antes de volver al asistente.

- **Fecha**: 
- **Cambios realizados**:
- **Archivos tocados**:
- **Observaciones / dudas**:

---

*Documento generado automáticamente. Actualizar tras cada fase completada o decisión arquitectural.*