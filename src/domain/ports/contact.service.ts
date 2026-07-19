import type { ContactFormValues } from "../models"

export interface ContactService {
  send(values: ContactFormValues): Promise<void>
}
