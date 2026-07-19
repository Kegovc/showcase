"use client"

import { ShoppingBag } from "lucide-react"
import { StoreFront } from "./store-front"
import { CartProvider, useCart } from "./cart-context"
import { CartDrawer } from "./cart-drawer"
import { submitContact } from "@/application/use-cases"
import { createContainer } from "@/infrastructure/di/container"
import type { CategoryRecord, ContactFormValues, HeroSlide, Product, ProductVariant } from "@/domain/models"

interface StoreFrontIslandProps {
  categories: CategoryRecord[]
  productsByCategory: Record<string, Product[]>
  heroSlides: HeroSlide[]
  contactImageUrl: string
}

function CartButton() {
  const { count, setOpen } = useCart()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Abrir carrito"
      className="fixed right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  )
}

function StoreFrontInner({
  categories,
  productsByCategory,
  heroSlides,
  contactImageUrl,
}: StoreFrontIslandProps) {
  const { add } = useCart()
  const container = createContainer()

  const handleSelectVariant = async (variant: ProductVariant, product: Product) => {
    void product
    await add(variant)
  }

  const handleContactSubmit = async (values: ContactFormValues) => {
    await submitContact({ contactService: container.contactService }, values)
  }

  const handleHeroSlideClick = (slide: HeroSlide) => {
    console.log("[storefront] Slide del hero:", slide)
  }

  return (
    <>
      <CartButton />
      <StoreFront
        categories={categories}
        productsByCategory={productsByCategory}
        heroSlides={heroSlides}
        contactImageUrl={contactImageUrl}
        onSelectVariant={handleSelectVariant}
        onHeroSlideClick={handleHeroSlideClick}
        onContactSubmit={handleContactSubmit}
      />
      <CartDrawer />
    </>
  )
}

export function StoreFrontIsland(props: StoreFrontIslandProps) {
  return (
    <CartProvider>
      <StoreFrontInner {...props} />
    </CartProvider>
  )
}
