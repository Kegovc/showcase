"use client";

import { useState } from "react";
import { CategoryTabs } from "./category-tabs";
import { HeroBanner } from "./hero-banner";
import { ProductRow } from "./product-row";
import { ContactSection } from "./contact-section";
import { defaultCatalog } from "@/types/storefront";
import type { CategoryRecord, ContactFormValues, HeroSlide, Product } from "@/types/storefront";

interface StoreFrontProps {
  categories: CategoryRecord[];
  productsByCategory: Record<string, Product[]>;
  heroSlides: HeroSlide[];
  contactImageUrl: string;
  onHeroSlideClick?: (slide: HeroSlide) => void;
  onContactSubmit?: (values: ContactFormValues) => void | Promise<void>;
  onAddProduct?: (product: Product) => void;
}

export function StoreFront({
  categories,
  productsByCategory,
  heroSlides,
  contactImageUrl,
  onHeroSlideClick,
  onContactSubmit,
  onAddProduct,
}: StoreFrontProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");
  const products = productsByCategory[activeCategory] ?? [];

  const typeLabels: Record<string, string> = {
    playera: "Playeras",
    shorts: "Shorts",
    buff: "Buffs",
    earcuffs: "Earcuffs",
  };

  const typesWithProducts = defaultCatalog.types.filter((type) =>
    products.some((p) => p.type === type),
  );

  return (
    <main className="min-h-screen bg-background">
      <CategoryTabs categories={categories} activeId={activeCategory} onChange={setActiveCategory} />

      <HeroBanner slides={heroSlides} onSlideClick={onHeroSlideClick} />

      <div className="mx-auto mt-6 max-w-5xl px-4">
        <hr className="border-border" />
      </div>

      {typesWithProducts.length > 0 ? (
        typesWithProducts.map((type) => (
          <ProductRow
            key={type}
            title={typeLabels[type] ?? type}
            products={products.filter((p) => p.type === type)}
            onAdd={(p) => onAddProduct?.(p)}
          />
        ))
      ) : (
        <p className="mx-auto max-w-5xl px-4 py-10 text-center text-muted-foreground">
          No hay productos en esta categoría.
        </p>
      )}

      <ContactSection imageUrl={contactImageUrl} onSubmit={onContactSubmit} />
    </main>
  );
}