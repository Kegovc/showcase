"use client"

import { cn } from "@/lib/utils"
import type { CategoryRecord } from "@/domain/models"

interface CategoryTabsProps {
  categories: CategoryRecord[]
  activeId: string
  onChange: (id: string) => void
}

export function CategoryTabs({ categories, activeId, onChange }: CategoryTabsProps) {
  return (
    <nav aria-label="Categorías" className="flex items-center justify-center gap-3 py-5">
      {categories.map((category) => {
        const isActive = category.id === activeId
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            aria-pressed={isActive}
            className={cn(
              "rounded-md border px-5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/40 bg-transparent text-primary hover:bg-accent",
            )}
          >
            {category.name}
          </button>
        )
      })}
    </nav>
  )
}
