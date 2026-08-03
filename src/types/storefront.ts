export type Category = "caballero" | "dama";

export type CategoryRecord = {
  id: string;
  name: string;
  kind: Category;
};

export type HeroSlide = {
  id: string;
  imageUrl: string;
  subtitle: string;
  title: string;
  ctaLabel: string;
  href: string;
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  type: string;
  format: string;
  variant: string;
  price: number;
  imageUrl: string;
};

export type ProductVariant = Product;

export type CartItem = {
  id: string;
  category: Category;
  type: string;
  format: string;
  variant: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type PaymentPreference = {
  id: string;
  initPoint: string;
  items: { title: string; unitPrice: number; quantity: number }[];
  total: number;
};

export function buildVariantName(
  type: string,
  format: string,
  variant: string,
): string {
  return `${type} · ${format} · ${variant}`;
}

export function cartCount(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(cart: Cart): number {
  return cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
}

export const defaultCatalog = {
  types: ["playera", "buff", "earcuffs"] as const,
  formats: {
    playera: ["pocatepetl", "mariposa"] as const,
    buff: ["montañas", "pocatepetl"] as const,
    earcuffs: ["montañas", "mariposa"] as const,
  },
  variants: {
    playera: {
      pocatepetl: ["S", "M", "L"] as const,
      mariposa: ["S", "M", "L"] as const,
    },
    buff: {
      montañas: ["unitalla", "rojo", "azul", "verde"] as const,
      pocatepetl: ["azul", "verde"] as const,
    },
    earcuffs: {
      montañas: ["izquierdo", "derecho"] as const,
      mariposa: ["izquierdo", "derecho"] as const,
    },
  },
} as const;

export function axis4LabelFor(
  type: string,
  format: string,
  variant: string,
): string {
  if (type === "playera") return variant;
  if (type === "buff") return variant;
  if (type === "earcuffs") return variant === "izquierdo" ? "Izquierdo" : "Derecho";
  return variant;
}