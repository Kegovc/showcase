// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
// Define la URL canónica del sitio (requerida para sitemap y OG absolutos).
// CAMBIA esto por tu dominio real al deployar.
export default defineConfig({
  site: 'https://tienda-ejemplo.com',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
