"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { axis4LabelFor, buildVariantName, defaultCatalog } from "@/types/storefront";
import type { CartItem, Product } from "@/types/storefront";
import { createPreference } from "@/lib/payment";
import { useCart } from "@/lib/cart";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

interface CartDrawerProps {
  allProducts: Product[];
}

function CartItemRow({ item, allProducts }: { item: CartItem; allProducts: Product[] }) {
  const { replace, setQuantity } = useCart();

  const family = useMemo(
    () => allProducts.filter((p) => p.category === item.category && p.type === item.type),
    [allProducts, item],
  );

  const formats = useMemo(() => Array.from(new Set(family.map((p) => p.format))), [family]);
  // axis4 options: all variants for this type across all formats
  const axis4Options = useMemo(() => {
    const typeVariants = defaultCatalog.variants[item.type as keyof typeof defaultCatalog.variants];
    if (!typeVariants) return [];
    return Array.from(
      new Set(Object.values(typeVariants).flatMap((v) => v)),
    );
  }, [item.type]);

  const [format, setFormat] = useState(item.format);
  const [axis4, setAxis4] = useState(item.variant);

  useEffect(() => {
    setFormat(item.format);
    setAxis4(item.variant);
  }, [item]);

  const resolved: Product | undefined = family.find(
    (p) => p.format === format && p.variant === axis4,
  );

  const handleChange = async () => {
    if (!resolved) return;
    await replace(item.id, resolved);
  };

  return (
    <li className="flex gap-3 rounded-md border border-border bg-background p-2">
      <img
        src={item.imageUrl || "/placeholder.svg"}
        alt={buildVariantName(item)}
        className="h-16 w-16 shrink-0 rounded object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm text-foreground">{item.type}</span>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Formato
          </span>
          <div className="flex flex-wrap gap-1">
            {formats.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFormat(f);
                  // Try to preserve current variant if it exists in new format
                  const variantExists = family.some((p) => p.format === f && p.variant === axis4);
                  if (variantExists) {
                    // Keep current axis4 (already set)
                  } else {
                    const first = family.find((p) => p.format === f);
                    if (first) setAxis4(first.variant);
                  }
                  queueMicrotask(() => void handleChange());
                }}
                className={`rounded border px-1.5 py-0.5 text-[11px] transition-colors ${
                  f === format
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {axis4LabelFor(item.type)}
          </span>
          <div className="flex flex-wrap gap-1">
            {axis4Options.map((opt) => {
              const exists = family.some((p) => p.format === format && p.variant === opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!exists}
                  onClick={() => {
                    setAxis4(opt);
                    queueMicrotask(() => void handleChange());
                  }}
                  className={`rounded border px-1.5 py-0.5 text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    opt === axis4
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <span className="text-sm font-semibold text-foreground">
          {formatPrice(item.price)} × {item.quantity}
        </span>

        <div className="mt-1 flex items-center gap-1">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            onClick={() => void setQuantity(item.id, item.quantity - 1)}
            className="flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-foreground transition-colors hover:bg-muted"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => {
              const q = Number(e.target.value);
              if (Number.isFinite(q)) void setQuantity(item.id, q);
            }}
            className="h-6 w-12 rounded border border-border bg-background px-1 text-center text-xs text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            aria-label="Aumentar cantidad"
            onClick={() => void setQuantity(item.id, item.quantity + 1)}
            className="flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-foreground transition-colors hover:bg-muted"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Eliminar producto"
            onClick={() => void setQuantity(item.id, 0)}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer({ allProducts }: CartDrawerProps) {
  const { cart, total, count, open, setOpen, clear } = useCart();
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState<{ id: string; total: number } | null>(null);

  const handlePay = async () => {
    try {
      setPaying(true);
      const pref = await createPreference(cart);
      setPaid({ id: pref.id, total: pref.total });
      await clear();
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-card shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Carrito de compra"
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <ShoppingBag className="h-5 w-5" />
            Carrito ({count})
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cart.items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Tu carrito está vacío.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {cart.items.map((item) => (
                <CartItemRow key={item.id} item={item} allProducts={allProducts} />
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-border px-4 py-3">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-base font-semibold text-foreground">
              {formatPrice(total)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void clear()}
              disabled={cart.items.length === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Vaciar
            </button>
            <button
              type="button"
              disabled={cart.items.length === 0 || paying}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              onClick={() => void handlePay()}
            >
              {paying ? "Procesando..." : "Pagar"}
            </button>
          </div>

          {paid && (
            <p className="mt-3 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary" role="status">
              Pago simulado exitoso (preferencia {paid.id}). Mercado Pago real se
              integra en una fase posterior.
            </p>
          )}
        </footer>
      </aside>
    </>
  );
}