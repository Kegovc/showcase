import type { CategoryRecord } from "../models"

export interface CategoryRepository {
  list(): Promise<CategoryRecord[]>
}
