import type {
  CartRepository,
  CategoryRepository,
  ContactService,
  HeroRepository,
  PaymentService,
  ProductRepository,
} from "@/domain/ports"
import {
  mockCartRepository,
  mockCategoryRepository,
  mockContactService,
  mockHeroRepository,
  mockPaymentService,
  mockProductRepository,
} from "@/infrastructure/adapters/mock"
import { mockContactImageUrl } from "@/infrastructure/data/mock-data"

export interface Container {
  categoryRepository: CategoryRepository
  productRepository: ProductRepository
  heroRepository: HeroRepository
  contactService: ContactService
  cartRepository: CartRepository
  paymentService: PaymentService
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
    cartRepository: mockCartRepository,
    paymentService: mockPaymentService,
    contactImageUrl: mockContactImageUrl,
  }
}
