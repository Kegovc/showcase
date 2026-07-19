import type { Product } from "../models"

export interface ProductRepository {
  /** Devuelve los productos agrupados por id de categoría */
  listByCategory(): Promise<Record<string, Product[]>>
}
