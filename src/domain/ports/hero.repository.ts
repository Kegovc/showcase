import type { HeroSlide } from "../models"

export interface HeroRepository {
  list(): Promise<HeroSlide[]>
}
