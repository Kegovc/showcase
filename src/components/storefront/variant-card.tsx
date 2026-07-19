"use client"

import type { ProductVariant } from "@/domain/models"

interface VariantCardProps {
  variant: ProductVariant
  /** Formato de precio opcional; por defecto usa USD */
  formatPrice?: (price: number) => string
  onSelect?: (variant: ProductVariant) => void
}

const defaultFormatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price)

export function VariantCard({ variant, formatPrice = defaultFormatPrice, onSelect }: VariantCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(variant)}
      className="group w-44 shrink-0 overflow-hidden rounded-md border border-border bg-card text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-square bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={variant.imageUrl || "/placeholder.svg"}
          alt={variant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/80 text-xs font-semibold text-background">
          {variant.size}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <span className="truncate text-sm text-foreground">{variant.name}</span>
        <span className="shrink-0 text-sm font-semibold text-foreground">{formatPrice(variant.price)}</span>
      </div>
    </button>
  )
}
