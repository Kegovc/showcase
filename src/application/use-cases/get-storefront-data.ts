import type {
  CategoryRepository,
  HeroRepository,
  ProductRepository,
} from "@/domain/ports"
import type { CategoryRecord, HeroSlide, Product } from "@/domain/models"

export interface StorefrontData {
  categories: CategoryRecord[]
  productsByCategory: Record<string, Product[]>
  heroSlides: HeroSlide[]
  contactImageUrl: string
}

export interface GetStorefrontDataDeps {
  categoryRepository: CategoryRepository
  productRepository: ProductRepository
  heroRepository: HeroRepository
  /** URL del asset de la sección de contacto */
  contactImageUrl: string
}

export async function getStorefrontData(
  deps: GetStorefrontDataDeps,
): Promise<StorefrontData> {
  const [categories, productsByCategory, heroSlides] = await Promise.all([
    deps.categoryRepository.list(),
    deps.productRepository.listByCategory(),
    deps.heroRepository.list(),
  ])

  return {
    categories,
    productsByCategory,
    heroSlides,
    contactImageUrl: deps.contactImageUrl,
  }
}
