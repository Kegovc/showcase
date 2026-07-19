"use client"

import { useState } from "react"
import type React from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ContactFormValues } from "@/domain/models"

interface ContactSectionProps {
  imageUrl: string
  /**
   * Método que se ejecuta al enviar el formulario.
   * Conéctalo más adelante con tu lógica (API, email, etc).
   * Puede ser async; el botón mostrará estado de envío mientras resuelve.
   */
  onSubmit?: (values: ContactFormValues) => void | Promise<void>
}

const initialValues: ContactFormValues = { name: "", email: "", message: "" }

export function ContactSection({ imageUrl, onSubmit }: ContactSectionProps) {
  const [values, setValues] = useState<ContactFormValues>(initialValues)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const update = (field: keyof ContactFormValues) => (e: { target: { value: string } }) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      setStatus("idle")
      await onSubmit?.(values)
      setValues(initialValues)
      setStatus("success")
    } catch {
      setStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <section className="py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-lg border border-border md:grid-cols-2">
        <div className="min-h-56 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-6">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Contacto</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                Nombre
              </label>
              <input
                id="contact-name"
                name="name"
                required
                value={values.name}
                onChange={update("name")}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={values.email}
                onChange={update("email")}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
              Mensaje
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              value={values.message}
              onChange={update("message")}
              className={cn(inputClass, "resize-y")}
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Enviar"}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {status === "success" && (
            <p className="mt-3 text-sm text-primary" role="status">
              ¡Gracias! Tu mensaje ha sido enviado (mock).
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              Ocurrió un error al enviar. Intenta de nuevo.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
