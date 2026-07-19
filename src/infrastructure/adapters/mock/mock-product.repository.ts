import type { ProductRepository } from "@/domain/ports"
import { mockProductsByCategory } from "@/infrastructure/data/mock-data"

export const mockProductRepository: ProductRepository = {
  listByCategory: async () => mockProductsByCategory,
}
