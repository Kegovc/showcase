import type { CategoryRecord, HeroSlide, Product } from "@/types/storefront";

const API_BASE = import.meta.env.VITE_API_BASE || "https://cxstdgjnurtpjqklfipn.supabase.co/functions/v1";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || "sire";

// Fallback data for when API is not available (e.g., during build)
const fallbackCategories: CategoryRecord[] = [
  { id: "caballero", name: "Caballero", kind: "caballero" },
  { id: "dama", name: "Dama", kind: "dama" },
];

const fallbackHeroSlides: HeroSlide[] = [
  { id: "s1", imageUrl: "images/hero-collection.png", subtitle: "Nueva colección", title: "Otoño / Invierno 2026", ctaLabel: "Ver colección", href: "#" },
  { id: "s2", imageUrl: "images/hero-sale.png", subtitle: "Tiempo limitado", title: "Hasta 40% de descuento", ctaLabel: "Comprar ofertas", href: "#" },
  { id: "s3", imageUrl: "images/hero.png", subtitle: "Para él y para ella", title: "Esenciales del guardarropa", ctaLabel: "Explorar", href: "#" },
];

const fallbackProductsByCategory: Record<string, Product[]> = {
  caballero: [
    { id: "p1-1", name: "Playera Pocatepetl S", category: "caballero", type: "playera", format: "pocatepetl", variant: "S", price: 299.99, imageUrl: "images/product-shirt.png" },
    { id: "p1-2", name: "Playera Pocatepetl M", category: "caballero", type: "playera", format: "pocatepetl", variant: "M", price: 319.99, imageUrl: "images/product-shirt.png" },
    { id: "p1-3", name: "Playera Pocatepetl L", category: "caballero", type: "playera", format: "pocatepetl", variant: "L", price: 339.99, imageUrl: "images/product-shirt.png" },
    { id: "p1-4", name: "Playera Mariposa M", category: "caballero", type: "playera", format: "mariposa", variant: "M", price: 329.99, imageUrl: "images/product-shirt.png" },
    { id: "p1-5", name: "Playera Mariposa L", category: "caballero", type: "playera", format: "mariposa", variant: "L", price: 349.99, imageUrl: "images/product-shirt.png" },
    { id: "p2-1", name: "Buff Montañas Unitalla", category: "caballero", type: "buff", format: "montañas", variant: "unitalla", price: 199.99, imageUrl: "images/product-jacket.png" },
    { id: "p2-2", name: "Buff Montañas Rojo", category: "caballero", type: "buff", format: "montañas", variant: "rojo", price: 209.99, imageUrl: "images/product-jacket.png" },
    { id: "p2-3", name: "Buff Pocatepetl Azul", category: "caballero", type: "buff", format: "pocatepetl", variant: "azul", price: 219.99, imageUrl: "images/product-jacket.png" },
    { id: "p2-4", name: "Buff Pocatepetl Verde", category: "caballero", type: "buff", format: "pocatepetl", variant: "verde", price: 219.99, imageUrl: "images/product-jacket.png" },
  ],
  dama: [
    { id: "p3-1", name: "Playera Mariposa S", category: "dama", type: "playera", format: "mariposa", variant: "S", price: 309.99, imageUrl: "images/product-dress.png" },
    { id: "p3-2", name: "Playera Mariposa M", category: "dama", type: "playera", format: "mariposa", variant: "M", price: 329.99, imageUrl: "images/product-dress.png" },
    { id: "p3-3", name: "Playera Pocatepetl M", category: "dama", type: "playera", format: "pocatepetl", variant: "M", price: 335.99, imageUrl: "images/product-dress.png" },
    { id: "p3-4", name: "Playera Pocatepetl L", category: "dama", type: "playera", format: "pocatepetl", variant: "L", price: 355.99, imageUrl: "images/product-dress.png" },
    { id: "p4-1", name: "Earcuffs Montañas Izq", category: "dama", type: "earcuffs", format: "montañas", variant: "izquierdo", price: 149.99, imageUrl: "images/product-shirt.png" },
    { id: "p4-2", name: "Earcuffs Montañas Der", category: "dama", type: "earcuffs", format: "montañas", variant: "derecho", price: 149.99, imageUrl: "images/product-shirt.png" },
    { id: "p4-3", name: "Earcuffs Mariposa Izq", category: "dama", type: "earcuffs", format: "mariposa", variant: "izquierdo", price: 159.99, imageUrl: "images/product-shirt.png" },
    { id: "p4-4", name: "Earcuffs Mariposa Der", category: "dama", type: "earcuffs", format: "mariposa", variant: "derecho", price: 159.99, imageUrl: "images/product-shirt.png" },
  ],
};

// During build time (static generation), skip API calls entirely to avoid network issues
// Check if we're in a build context (no window object, or running in Node.js build environment)
const isBuildTime = typeof window === 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

async function fetchFromAPI<T>(endpoint: string, fallback: T): Promise<T> {
  // During build time, skip API calls entirely to avoid network issues
  if (isBuildTime) {
    return fallback;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      headers: { 'x-company-id': import.meta.env.VITE_COMPANY_ID || 'sire' },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch {
    return fallback;
  }
}

export async function getCategories(): Promise<CategoryRecord[]> {
  return fetchFromAPI<CategoryRecord[]>('catalog-categories', fallbackCategories);
}

export async function getProductsByCategory(): Promise<Record<string, Product[]>> {
  return fetchFromAPI<Record<string, Product[]>>('catalog-products', fallbackProductsByCategory);
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return fetchFromAPI<HeroSlide[]>('catalog-hero-slides', fallbackHeroSlides);
}

export async function getContactImageUrl(): Promise<string> {
  return "images/contact.png";
}

export async function getStorefrontData() {
  const [categories, productsByCategory, heroSlides, contactImageUrl] = await Promise.all([
    getCategories(),
    getProductsByCategory(),
    getHeroSlides(),
    getContactImageUrl(),
  ]);
  return { categories, productsByCategory, heroSlides, contactImageUrl };
}