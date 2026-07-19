import type { Category, CategoryRecord, HeroSlide, Product, ProductVariant } from "@/domain/models"

// Helper: construye variantes recorriendo combinaciones de los 4 ejes.
const makeVariant = (
  base: string,
  n: number,
  category: Category,
  type: string,
  format: string,
  variant: string,
  imageUrl: string,
): ProductVariant => ({
  id: `${base}-${n}`,
  category,
  type,
  format,
  variant,
  price: 999.99,
  imageUrl,
})

export const mockCategories: CategoryRecord[] = [
  { id: "caballero", name: "Caballero", kind: "caballero" },
  { id: "dama", name: "Dama", kind: "dama" },
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

// Variantes demo expresadas por los 4 ejes (sin name suelto).
export const mockProductsByCategory: Record<string, Product[]> = {
  caballero: [
    {
      id: "p1",
      name: "Producto 1",
      variants: [
        makeVariant("p1", 1, "caballero", "playera", "pocatepetl", "S", "/images/product-shirt.png"),
        makeVariant("p1", 2, "caballero", "playera", "pocatepetl", "M", "/images/product-shirt.png"),
        makeVariant("p1", 3, "caballero", "playera", "pocatepetl", "L", "/images/product-shirt.png"),
        makeVariant("p1", 4, "caballero", "playera", "mariposa", "M", "/images/product-shirt.png"),
        makeVariant("p1", 5, "caballero", "shorts", "montañas", "L", "/images/product-jacket.png"),
      ],
    },
    {
      id: "p2",
      name: "Producto 2",
      variants: [
        makeVariant("p2", 1, "caballero", "buff", "montañas", "unitalla", "/images/product-jacket.png"),
        makeVariant("p2", 2, "caballero", "buff", "pocatepetl", "rojo", "/images/product-jacket.png"),
        makeVariant("p2", 3, "caballero", "earcuffs", "mariposa", "izquierdo", "/images/product-jacket.png"),
        makeVariant("p2", 4, "caballero", "earcuffs", "mariposa", "derecho", "/images/product-jacket.png"),
        makeVariant("p2", 5, "caballero", "playera", "montañas", "XL", "/images/product-shirt.png"),
      ],
    },
  ],
  dama: [
    {
      id: "p3",
      name: "Producto 1",
      variants: [
        makeVariant("p3", 1, "dama", "playera", "mariposa", "S", "/images/product-dress.png"),
        makeVariant("p3", 2, "dama", "playera", "mariposa", "M", "/images/product-dress.png"),
        makeVariant("p3", 3, "dama", "buff", "pocatepetl", "azul", "/images/product-dress.png"),
        makeVariant("p3", 4, "dama", "earcuffs", "montañas", "izquierdo", "/images/product-dress.png"),
        makeVariant("p3", 5, "dama", "shorts", "pocatepetl", "M", "/images/product-dress.png"),
      ],
    },
    {
      id: "p4",
      name: "Producto 2",
      variants: [
        makeVariant("p4", 1, "dama", "playera", "pocatepetl", "M", "/images/product-shirt.png"),
        makeVariant("p4", 2, "dama", "playera", "pocatepetl", "L", "/images/product-shirt.png"),
        makeVariant("p4", 3, "dama", "buff", "montañas", "verde", "/images/product-shirt.png"),
        makeVariant("p4", 4, "dama", "earcuffs", "mariposa", "derecho", "/images/product-shirt.png"),
        makeVariant("p4", 5, "dama", "shorts", "montañas", "L", "/images/product-shirt.png"),
      ],
    },
  ],
}

export const mockContactImageUrl = "/images/contact.png"
