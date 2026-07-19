"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { HeroSlide } from "./types"

interface HeroBannerProps {
  slides: HeroSlide[]
  /** Intervalo del autoplay en ms (por defecto 5000). Pasa 0 para desactivarlo. */
  autoplayDelay?: number
  onSlideClick?: (slide: HeroSlide) => void
}

export function HeroBanner({ slides, autoplayDelay = 5000, onSlideClick }: HeroBannerProps) {
  const autoplay = autoplayDelay > 0 ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })] : []
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, autoplay)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  if (slides.length === 0) return null

  return (
    <section className="px-4" aria-roledescription="carrusel" aria-label="Promociones y colecciones">
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-lg bg-muted">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {slides.map((slide) => (
              <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
                <button
                  type="button"
                  onClick={() => onSlideClick?.(slide)}
                  className="group block aspect-[16/7] w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.imageUrl || "/placeholder.svg"}
                    alt={slide.title ?? ""}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  {(slide.title || slide.subtitle || slide.ctaLabel) && (
                    <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 bg-gradient-to-t from-foreground/50 to-transparent p-6 text-left md:p-10">
                      {slide.subtitle && (
                        <span className="text-sm font-medium text-background/90 md:text-base">{slide.subtitle}</span>
                      )}
                      {slide.title && (
                        <h2 className="text-2xl font-semibold text-balance text-background md:text-4xl">
                          {slide.title}
                        </h2>
                      )}
                      {slide.ctaLabel && (
                        <span className="mt-2 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform group-hover:scale-105">
                          {slide.ctaLabel}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir al slide ${i + 1}`}
                  aria-current={i === selectedIndex}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex ? "w-6 bg-background" : "w-2 bg-background/60 hover:bg-background/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
