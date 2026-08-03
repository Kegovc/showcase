"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/domain/models"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price)

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      className="group w-44 shrink-0 overflow-hidden rounded-md border border-border bg-card text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-square bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-1 px-3 py-2.5">
        <span className="truncate text-sm text-foreground">{product.name}</span>
        <span className="text-xs text-muted-foreground">{product.type}</span>
        <span className="shrink-0 text-sm font-semibold text-foreground">
          {formatPrice(product.price)}
        </span>
      </div>
    </button>
  )
}

interface ProductRowProps {
  title: string
  products: Product[]
  onAdd: (product: Product) => void
}

export function ProductRow({ title, products, onAdd }: ProductRowProps) {
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
        <h2 className="inline-block text-lg font-medium text-primary underline underline-offset-4">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canPrev}
            aria-label={`Anterior en ${title}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canNext}
            aria-label={`Siguiente en ${title}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={emblaRef} className="mt-4 overflow-hidden md:mx-auto md:max-w-5xl">
        <div className="flex gap-4 px-4">
          {products.map((product) => (
            <div key={product.id} className="min-w-0 shrink-0">
              <ProductCard product={product} onAdd={onAdd} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
