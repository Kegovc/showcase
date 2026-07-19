import type { Category } from "../models"

export interface CategoryRepository {
  list(): Promise<Category[]>
}
