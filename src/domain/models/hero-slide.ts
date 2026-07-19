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
