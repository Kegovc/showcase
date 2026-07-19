import type { CartRepository } from "@/domain/ports"
import type { Cart } from "@/domain/models"

export interface GetCartDeps {
  cartRepository: CartRepository
}

export async function getCart(deps: GetCartDeps): Promise<Cart> {
  return deps.cartRepository.get()
}
