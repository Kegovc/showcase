import type { Category } from "./product-variant"

/**
 * Catálogo de rangos del dominio.
 * Define los valores válidos por eje y la etiqueta del 4º eje,
 * que cambia según el type (talla / color / lado).
 */
export interface ProductCatalog {
  categories: Category[]
  types: string[]
  formats: string[]
  /** Etiqueta del eje 4 por tipo: "Talla" | "Color" | "Lado" */
  axis4Labels: Record<string, string>
  /** Valores del eje 4 por tipo */
  axis4Values: Record<string, string[]>
}

export const defaultCatalog: ProductCatalog = {
  categories: ["caballero", "dama"],
  types: ["playera", "shorts", "buff", "earcuffs"],
  formats: ["pocatepetl", "mariposa", "montañas"],
  axis4Labels: {
    playera: "Talla",
    shorts: "Talla",
    buff: "Color",
    earcuffs: "Lado",
  },
  axis4Values: {
    playera: ["S", "M", "L", "XL"],
    shorts: ["S", "M", "L", "XL"],
    buff: ["unitalla", "rojo", "azul", "verde"],
    earcuffs: ["izquierdo", "derecho"],
  },
}

/** Devuelve la etiqueta del eje 4 para un type dado. */
export function axis4LabelFor(type: string, catalog: ProductCatalog = defaultCatalog): string {
  return catalog.axis4Labels[type] ?? "Variante"
}
