export type Category = "caballero" | "dama"

/**
 * Variante de producto definida por 4 ejes (discriminantes):
 * 1. category — caballero | dama
 * 2. type     — playera, shorts, buff, earcuffs, ...
 * 3. format   — estampado / acabado (pocatepetl, mariposa, ...)
 * 4. variant  — eje neutro según el type:
 *                ropa  -> talla (S, M, L, XL)
 *                buff  -> color / unitalla
 *                earcuffs -> lado (izquierdo, derecho)
 *
 * El `name` NO se almacena: se calcula con buildVariantName() a partir de los 4 ejes.
 */
export interface ProductVariant {
  id: string
  category: Category
  type: string
  format: string
  variant: string
  /** Precio en la moneda que manejes */
  price: number
  /** URL de la imagen de la variante */
  imageUrl: string
}

export function buildVariantName(v: ProductVariant): string {
  return [v.category, v.type, v.format, v.variant].join(" · ")
}
