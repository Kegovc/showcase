"use client"

import { StoreFront } from "./store-front"
import { submitContact } from "@/application/use-cases"
import { createContainer } from "@/infrastructure/di/container"
import type { Category, ContactFormValues, HeroSlide, Product, ProductVariant } from "@/domain/models"

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
  const container = createContainer()

  const handleSelectVariant = (variant: ProductVariant, product: Product) => {
    // Aquí va tu lógica (abrir detalle, agregar al carrito, etc.)
    console.log("[storefront] Variante seleccionada:", product.name, variant)
  }

  const handleContactSubmit = async (values: ContactFormValues) => {
    await submitContact({ contactService: container.contactService }, values)
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
