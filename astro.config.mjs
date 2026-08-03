// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

const isProduction = process.env.NODE_ENV === 'production';
const repoName = 'e-commerce-clothing-app';
const githubUser = 'TU_USUARIO_GITHUB'; // CAMBIA ESTO por tu usuario de GitHub

// https://astro.build/config
export default defineConfig({
  site: `https://${githubUser}.github.io`,
  base: isProduction ? `/${repoName}/` : undefined,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
})