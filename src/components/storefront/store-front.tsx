"use client"

import { useState } from "react"
import { CategoryTabs } from "./category-tabs"
import { HeroBanner } from "./hero-banner"
import { ProductRow } from "./product-row"
import { ContactSection } from "./contact-section"
import type { Category, ContactFormValues, HeroSlide, Product, ProductVariant } from "./types"

interface StoreFrontProps {
  categories: Category[]
  /** Productos agrupados por id de categoría */
  productsByCategory: Record<string, Product[]>
  /** Slides del hero (promos y/o colecciones) */
  heroSlides: HeroSlide[]
  contactImageUrl: string
  formatPrice?: (price: number) => string
  onSelectVariant?: (variant: ProductVariant, product: Product) => void
  onHeroSlideClick?: (slide: HeroSlide) => void
  onContactSubmit?: (values: ContactFormValues) => void | Promise<void>
}

export function StoreFront({
  categories,
  productsByCategory,
  heroSlides,
  contactImageUrl,
  formatPrice,
  onSelectVariant,
  onHeroSlideClick,
  onContactSubmit,
}: StoreFrontProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "")
  const products = productsByCategory[activeCategory] ?? []

  return (
    <main className="min-h-screen bg-background">
      <CategoryTabs categories={categories} activeId={activeCategory} onChange={setActiveCategory} />

      <HeroBanner slides={heroSlides} onSlideClick={onHeroSlideClick} />

      <div className="mx-auto mt-6 max-w-5xl px-4">
        <hr className="border-border" />
      </div>

      {products.length > 0 ? (
        products.map((product, index) => (
          <div key={product.id}>
            <ProductRow product={product} formatPrice={formatPrice} onSelectVariant={onSelectVariant} />
            <div className="mx-auto max-w-5xl px-4">
              <hr className="border-border" />
            </div>
          </div>
        ))
      ) : (
        <p className="mx-auto max-w-5xl px-4 py-10 text-center text-muted-foreground">
          No hay productos en esta categoría.
        </p>
      )}

      <ContactSection imageUrl={contactImageUrl} onSubmit={onContactSubmit} />
    </main>
  )
}
