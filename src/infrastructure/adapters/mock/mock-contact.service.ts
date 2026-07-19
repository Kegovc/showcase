import type { ContactService } from "@/domain/ports"
import type { ContactFormValues } from "@/domain/models"

export const mockContactService: ContactService = {
  send: async (values: ContactFormValues) => {
    // Placeholder: reemplazar por la integración real (API/email) en el futuro.
    console.log("[mock-contact] Formulario de contacto enviado:", values)
  },
}
