import type { APIRoute } from 'astro'

const robots = (site: string): string => `User-agent: *
Allow: /

Sitemap: ${site}sitemap-index.xml
`

export const GET: APIRoute = ({ site }) => {
  const base = site?.href ?? 'https://tienda-ejemplo.com'
  return new Response(robots(base), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
