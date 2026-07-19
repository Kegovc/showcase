"use client"

import { X, ShoppingBag, Trash2 } from "lucide-react"
import { axis4LabelFor, buildVariantName } from "@/domain/models"
import { useCart } from "./cart-context"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price)

export function CartDrawer() {
  const { cart, total, count, open, setOpen, clear } = useCart()

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
                <li
                  key={item.id}
                  className="flex gap-3 rounded-md border border-border bg-background p-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={buildVariantName(item)}
                    className="h-16 w-16 shrink-0 rounded object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm text-foreground">
                      {item.type} · {item.format}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.category} · {axis4LabelFor(item.type)}: {item.variant}
                    </span>
                    <span className="mt-auto text-sm font-semibold text-foreground">
                      {formatPrice(item.price)} × {item.quantity}
                    </span>
                  </div>
                </li>
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
              disabled={cart.items.length === 0}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              onClick={() =>
                alert("Pago simulado (Mercado Pago se integra en fase posterior).")
              }
            >
              Pagar
            </button>
          </div>
        </footer>
      </aside>
    </>
  )
}
