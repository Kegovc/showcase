"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { StoreFront } from "./store-front";
import { CartProvider, useCart } from "@/lib/cart";
import { CartDrawer } from "./cart-drawer";
import { getStorefrontData } from "@/lib/data";
import { sendContact } from "@/lib/contact";
import type { CategoryRecord, ContactFormValues, HeroSlide, Product } from "@/types/storefront";

function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Abrir carrito"
      className="fixed right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  );
}

function StoreFrontInner() {
  const { add } = useCart();
  const [data, setData] = useState<{
    categories: CategoryRecord[];
    productsByCategory: Record<string, Product[]>;
    heroSlides: HeroSlide[];
    contactImageUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStorefrontData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-muted-foreground">Cargando tienda…</span>
      </div>
    );
  }

  const { categories, productsByCategory, heroSlides, contactImageUrl } = data;
  const allProducts = Object.values(productsByCategory).flat();

  const handleContactSubmit = async (values: ContactFormValues) => {
    await sendContact(values);
  };

  const handleHeroSlideClick = (slide: HeroSlide) => {
    console.log("[storefront] Slide del hero:", slide);
  };

  return (
    <>
      <CartButton />
      <StoreFront
        categories={categories}
        productsByCategory={productsByCategory}
        heroSlides={heroSlides}
        contactImageUrl={contactImageUrl}
        onHeroSlideClick={handleHeroSlideClick}
        onContactSubmit={handleContactSubmit}
        onAddProduct={add}
      />
      <CartDrawer allProducts={allProducts} />
    </>
  );
}

export function StoreFrontIsland() {
  return (
    <CartProvider>
      <StoreFrontInner />
    </CartProvider>
  );
}