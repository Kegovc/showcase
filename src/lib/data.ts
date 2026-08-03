import type { CategoryRecord, HeroSlide, Product } from "@/types/storefront";

const makeProduct = (
  id: string,
  name: string,
  category: "caballero" | "dama",
  type: string,
  format: string,
  variant: string,
  price: number,
  imageUrl: string,
): Product => ({ id, name, category, type, format, variant, price, imageUrl });

const categories: CategoryRecord[] = [
  { id: "caballero", name: "Caballero", kind: "caballero" },
  { id: "dama", name: "Dama", kind: "dama" },
];

const heroSlides: HeroSlide[] = [
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
];

const productsByCategory: Record<string, Product[]> = {
  caballero: [
    makeProduct("p1-1", "Playera Pocatepetl S", "caballero", "playera", "pocatepetl", "S", 299.99, "/images/product-shirt.png"),
    makeProduct("p1-2", "Playera Pocatepetl M", "caballero", "playera", "pocatepetl", "M", 319.99, "/images/product-shirt.png"),
    makeProduct("p1-3", "Playera Pocatepetl L", "caballero", "playera", "pocatepetl", "L", 339.99, "/images/product-shirt.png"),
    makeProduct("p1-4", "Playera Mariposa M", "caballero", "playera", "mariposa", "M", 329.99, "/images/product-shirt.png"),
    makeProduct("p1-5", "Playera Mariposa L", "caballero", "playera", "mariposa", "L", 349.99, "/images/product-shirt.png"),
    makeProduct("p2-1", "Buff Montañas Unitalla", "caballero", "buff", "montañas", "unitalla", 199.99, "/images/product-jacket.png"),
    makeProduct("p2-2", "Buff Montañas Rojo", "caballero", "buff", "montañas", "rojo", 209.99, "/images/product-jacket.png"),
    makeProduct("p2-3", "Buff Pocatepetl Azul", "caballero", "buff", "pocatepetl", "azul", 219.99, "/images/product-jacket.png"),
    makeProduct("p2-4", "Buff Pocatepetl Verde", "caballero", "buff", "pocatepetl", "verde", 219.99, "/images/product-jacket.png"),
  ],
  dama: [
    makeProduct("p3-1", "Playera Mariposa S", "dama", "playera", "mariposa", "S", 309.99, "/images/product-dress.png"),
    makeProduct("p3-2", "Playera Mariposa M", "dama", "playera", "mariposa", "M", 329.99, "/images/product-dress.png"),
    makeProduct("p3-3", "Playera Pocatepetl M", "dama", "playera", "pocatepetl", "M", 335.99, "/images/product-dress.png"),
    makeProduct("p3-4", "Playera Pocatepetl L", "dama", "playera", "pocatepetl", "L", 355.99, "/images/product-dress.png"),
    makeProduct("p4-1", "Earcuffs Montañas Izq", "dama", "earcuffs", "montañas", "izquierdo", 149.99, "/images/product-shirt.png"),
    makeProduct("p4-2", "Earcuffs Montañas Der", "dama", "earcuffs", "montañas", "derecho", 149.99, "/images/product-shirt.png"),
    makeProduct("p4-3", "Earcuffs Mariposa Izq", "dama", "earcuffs", "mariposa", "izquierdo", 159.99, "/images/product-shirt.png"),
    makeProduct("p4-4", "Earcuffs Mariposa Der", "dama", "earcuffs", "mariposa", "derecho", 159.99, "/images/product-shirt.png"),
  ],
};

const contactImageUrl = "/images/contact.png";

export async function getCategories(): Promise<CategoryRecord[]> {
  return categories;
}

export async function getProductsByCategory(): Promise<Record<string, Product[]>> {
  return productsByCategory;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return heroSlides;
}

export async function getContactImageUrl(): Promise<string> {
  return contactImageUrl;
}

export async function getStorefrontData() {
  const [categories, productsByCategory, heroSlides, contactImageUrl] = await Promise.all([
    getCategories(),
    getProductsByCategory(),
    getHeroSlides(),
    getContactImageUrl(),
  ]);

  return {
    categories,
    productsByCategory,
    heroSlides,
    contactImageUrl,
  };
}