import type { ContactFormValues } from "@/types/storefront";

export async function sendContact(values: ContactFormValues): Promise<void> {
  // Placeholder: reemplazar por la integración real (API/email) en el futuro.
  console.log("[contact] Formulario de contacto enviado:", values);
}