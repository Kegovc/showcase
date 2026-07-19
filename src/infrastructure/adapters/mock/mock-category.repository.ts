import type { CategoryRepository } from "@/domain/ports"
import { mockCategories } from "@/infrastructure/data/mock-data"

export const mockCategoryRepository: CategoryRepository = {
  list: async () => mockCategories,
}
