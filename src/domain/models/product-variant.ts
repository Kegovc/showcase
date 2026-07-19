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
