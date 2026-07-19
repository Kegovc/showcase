import type { ContactService } from "@/domain/ports"
import type { ContactFormValues } from "@/domain/models"

export interface SubmitContactDeps {
  contactService: ContactService
}

export async function submitContact(
  deps: SubmitContactDeps,
  values: ContactFormValues,
): Promise<void> {
  await deps.contactService.send(values)
}
