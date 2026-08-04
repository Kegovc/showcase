import type { CategoryRecord, HeroSlide, Product } from "@/types/storefront";

const API_BASE = import.meta.env.VITE_API_BASE || "https://cxstdgjnurtpjqklfipn.supabase.co/functions/v1";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || "sire";

async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    headers: {
      'x-company-id': import.meta.env.VITE_COMPANY_ID || 'sire',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function getCategories(): Promise<CategoryRecord[]> {
  return fetchFromAPI<CategoryRecord[]>('catalog-categories');
}

export async function getProductsByCategory(): Promise<Record<string, Product[]>> {
  return fetchFromAPI<Record<string, Product[]>>('catalog-products');
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return fetchFromAPI<HeroSlide[]>('catalog-hero-slides');
}

export async function getContactImageUrl(): Promise<string> {
  // This endpoint doesn't exist yet, return a default
  return "images/contact.png";
}

export async function getStorefrontData() {
  const [categories, productsByCategory, heroSlides, contactImageUrl] = await Promise.all([
    getCategories(),
    getProductsByCategory(),
    getHeroSlides(),
    getContactImageUrl(),
  ]);

  return {
    categories,
    productsByCategory,
    heroSlides,
    contactImageUrl,
  };
}