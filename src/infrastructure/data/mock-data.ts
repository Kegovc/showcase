import type { Category, HeroSlide, Product, ProductVariant } from "@/domain/models"

const makeVariants = (img: string, base: string): ProductVariant[] => [
  { id: `${base}-1`, name: "Variante 1", size: "S", price: 999.99, imageUrl: img },
  { id: `${base}-2`, name: "Variante 1", size: "M", price: 999.99, imageUrl: img },
  { id: `${base}-3`, name: "Variante 2", size: "L", price: 999.99, imageUrl: img },
  { id: `${base}-4`, name: "Variante 2", size: "S", price: 999.99, imageUrl: img },
  { id: `${base}-5`, name: "Variante 3", size: "M", price: 999.99, imageUrl: img },
]

export const mockCategories: Category[] = [
  { id: "caballero", name: "Caballero" },
  { id: "dama", name: "Dama" },
]

export const mockHeroSlides: HeroSlide[] = [
  {
    id: "s1",
    imageUrl: "/images/hero-collection.png",
    subtitle: "Nueva colección",
    title: "Otoño / Invierno 2026",
    ctaLabel: "Ver colección",
    href: "#",
  },
  {
    id: "s2",
    imageUrl: "/images/hero-sale.png",
    subtitle: "Tiempo limitado",
    title: "Hasta 40% de descuento",
    ctaLabel: "Comprar ofertas",
    href: "#",
  },
  {
    id: "s3",
    imageUrl: "/images/hero.png",
    subtitle: "Para él y para ella",
    title: "Esenciales del guardarropa",
    ctaLabel: "Explorar",
    href: "#",
  },
]

export const mockProductsByCategory: Record<string, Product[]> = {
  caballero: [
    { id: "p1", name: "Producto 1", variants: makeVariants("/images/product-shirt.png", "p1") },
    { id: "p2", name: "Producto 2", variants: makeVariants("/images/product-jacket.png", "p2") },
  ],
  dama: [
    { id: "p3", name: "Producto 1", variants: makeVariants("/images/product-dress.png", "p3") },
    { id: "p4", name: "Producto 2", variants: makeVariants("/images/product-shirt.png", "p4") },
  ],
}

export const mockContactImageUrl = "/images/contact.png"
