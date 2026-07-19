// Tipos compartidos del storefront.
// Estos tipos son agnósticos del framework: puedes reutilizarlos tal cual
// en tus islas de React dentro de Astro.

export interface Category {
  id: string
  name: string
}

export interface HeroSlide {
  id: string
  /** URL de la imagen del slide (promo o colección) */
  imageUrl: string
  /** Texto opcional sobrepuesto */
  title?: string
  subtitle?: string
  /** Texto del botón opcional */
  ctaLabel?: string
  /** Enlace opcional al hacer clic en el slide o el botón */
  href?: string
}

export interface ProductVariant {
  id: string
  /** Nombre de la variante, ej: "Variante 1", "Azul marino" */
  name: string
  /** Talla mostrada en el badge, ej: "S" | "M" | "L" */
  size: string
  /** Precio en la moneda que manejes */
  price: number
  /** URL de la imagen de la variante */
  imageUrl: string
}

export interface Product {
  id: string
  name: string
  variants: ProductVariant[]
}

export interface ContactFormValues {
  name: string
  email: string
  message: string
}
