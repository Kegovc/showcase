import type {
  CategoryRepository,
  ContactService,
  HeroRepository,
  ProductRepository,
} from "@/domain/ports"
import {
  mockCategoryRepository,
  mockContactService,
  mockHeroRepository,
  mockProductRepository,
} from "@/infrastructure/adapters/mock"
import { mockContactImageUrl } from "@/infrastructure/data/mock-data"

export interface Container {
  categoryRepository: CategoryRepository
  productRepository: ProductRepository
  heroRepository: HeroRepository
  contactService: ContactService
  contactImageUrl: string
}

// Composición de dependencias.
// Hoy resuelve con adaptadores mock; para usar proveedores reales (HTTP/CMS)
// basta reemplazar estos bindings sin tocar dominio, casos de uso ni UI.
export function createContainer(): Container {
  return {
    categoryRepository: mockCategoryRepository,
    productRepository: mockProductRepository,
    heroRepository: mockHeroRepository,
    contactService: mockContactService,
    contactImageUrl: mockContactImageUrl,
  }
}
