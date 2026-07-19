import type { CartRepository } from "@/domain/ports"
import type { ProductVariant } from "@/domain/models"

export interface AddToCartDeps {
  cartRepository: CartRepository
}

export async function addToCart(
  deps: AddToCartDeps,
  variant: ProductVariant,
): Promise<void> {
  await deps.cartRepository.add(variant)
}
