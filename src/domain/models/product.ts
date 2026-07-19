import type { ProductVariant } from "./product-variant"

export interface Product {
  id: string
  name: string
  variants: ProductVariant[]
}
