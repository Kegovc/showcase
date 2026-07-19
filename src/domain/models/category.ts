import type { Category } from "./product-variant"

export interface CategoryRecord {
  id: string
  name: string
  /** Eje 1 del producto al que pertenece esta categoría */
  kind: Category
}
