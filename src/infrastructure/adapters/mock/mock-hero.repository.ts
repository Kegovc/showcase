import type { HeroRepository } from "@/domain/ports"
import { mockHeroSlides } from "@/infrastructure/data/mock-data"

export const mockHeroRepository: HeroRepository = {
  list: async () => mockHeroSlides,
}
