"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product, ProductVariant } from "./types"
import { VariantCard } from "./variant-card"

interface ProductRowProps {
  product: Product
  formatPrice?: (price: number) => string
  onSelectVariant?: (variant: ProductVariant, product: Product) => void
}

export function ProductRow({ product, formatPrice, onSelectVariant }: ProductRowProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
    }
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  return (
    <section className="py-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
        <h2 className="inline-block text-lg font-medium text-primary underline underline-offset-4">{product.name}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canPrev}
            aria-label={`Anterior en ${product.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canNext}
            aria-label={`Siguiente en ${product.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={emblaRef} className="mt-4 overflow-hidden md:mx-auto md:max-w-5xl">
        <div className="flex gap-4 px-4">
          {product.variants.map((variant) => (
            <div key={variant.id} className="min-w-0 shrink-0">
              <VariantCard
                variant={variant}
                formatPrice={formatPrice}
                onSelect={(v) => onSelectVariant?.(v, product)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
