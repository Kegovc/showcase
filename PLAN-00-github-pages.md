# PLAN-00: Deploy a GitHub Pages (Repo Privado, Pages Público)

> **Objetivo**: Front Astro estático en `https://usuario.github.io/repo-name/` con CI/CD automático. Backend separado en Supabase.

---

## Configuración Requerida

### GitHub (Manual, una vez)
- [ ] Repo privado creado
- [ ] Settings → Pages → Source: "GitHub Actions"
- [ ] Settings → Actions → General → ✅ Allow GitHub Actions to create and approve PRs

### Código

#### `astro.config.mjs`
```javascript
const isProduction = process.env.NODE_ENV === 'production';
const repoName = 'e-commerce-clothing-app';

export default defineConfig({
  site: 'https://TU_USUARIO.github.io',
  base: isProduction ? `/${repoName}/` : undefined,
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
});
```

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: corepack enable pnpm && pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

#### Secrets (Settings → Secrets → Actions)
| Secret | Valor |
|--------|-------|
| `VITE_API_BASE` | `https://<project-ref>.supabase.co/functions/v1` |
| `VITE_COMPANY_ID` | `demo` |

---

## Verificación Local
```bash
NODE_ENV=production pnpm build
ls dist/  # verificar prefijo /e-commerce-clothing-app/
```

---

## Tasks & Progress

### Phase 0: Setup
- [ ] 0.1 Crear repo privado en GitHub
- [ ] 0.2 Configurar Pages → GitHub Actions
- [ ] 0.3 Añadir `astro.config.mjs` con `base` path
- [ ] 0.4 Crear `.github/workflows/deploy.yml`
- [ ] 0.5 Configurar secrets (`VITE_API_BASE`, `VITE_COMPANY_ID`)
- [ ] 0.6 Push a `main` → verificar deploy
- [ ] 0.7 Verificar URL pública accesible: `https://usuario.github.io/repo-name/`

> **Nota**: Custom domain (CNAME, DNS, HTTPS) se hará en fase futura si se requiere.