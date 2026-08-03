# E-commerce Clothing App

Tienda de ropa (dama y caballero) construida con **Astro** + **React** (islas) + **Tailwind CSS v4**.

## Requisitos

- Node.js `>= 22.12.0` (ver `.nvmrc`)
- pnpm

## Scripts

```bash
pnpm dev      # servidor de desarrollo (http://localhost:4321)
pnpm build    # build de producción a dist/
pnpm preview  # previsualizar el build
pnpm astro check  # chequeo de tipos
```

## Estructura

```
src/
  components/storefront/   componentes del storefront (islas React)
  components/ui/           componentes base (shadcn/base-ui)
  layouts/Layout.astro     layout global (head, fuentes, metadata)
  lib/utils.ts             utilidades (cn)
  pages/index.astro        página principal + datos demo
  styles/globals.css       tema (tokens oklch light/dark) + Tailwind
public/                    assets estáticos (imágenes, iconos)
```

## Notas

- La interactividad (carruseles, tabs, formulario) vive en la isla
  `store-front-island.tsx`, montada con `client:load`.
- Los datos son de ejemplo en `src/pages/index.astro`; se sustituirán por
  una capa de dominio + adaptadores en fases posteriores.



> opencode -s ses_087dc2718ffe7xIYsxGdrbsx1O
## ponytail
> opencode -s ses_03ae5426dffeuHRPWZsS8l2XDt