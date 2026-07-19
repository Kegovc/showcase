"use client"

import { StoreFront } from "./store-front"
import type { Category, ContactFormValues, HeroSlide, Product, ProductVariant } from "./types"

interface StoreFrontIslandProps {
  categories: Category[]
  productsByCategory: Record<string, Product[]>
  heroSlides: HeroSlide[]
  contactImageUrl: string
}

export function StoreFrontIsland({
  categories,
  productsByCategory,
  heroSlides,
  contactImageUrl,
}: StoreFrontIslandProps) {
  const handleSelectVariant = (variant: ProductVariant, product: Product) => {
    // Aquí va tu lógica (abrir detalle, agregar al carrito, etc.)
    console.log("[storefront] Variante seleccionada:", product.name, variant)
  }

  const handleContactSubmit = async (values: ContactFormValues) => {
    // Reemplaza esto por el método que implementarás más adelante.
    console.log("[storefront] Formulario de contacto enviado:", values)
  }

  const handleHeroSlideClick = (slide: HeroSlide) => {
    // Aquí va tu navegación (ir a la colección o promo).
    console.log("[storefront] Slide del hero:", slide)
  }

  return (
    <StoreFront
      categories={categories}
      productsByCategory={productsByCategory}
      heroSlides={heroSlides}
      contactImageUrl={contactImageUrl}
      onSelectVariant={handleSelectVariant}
      onHeroSlideClick={handleHeroSlideClick}
      onContactSubmit={handleContactSubmit}
    />
  )
}
