import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { gallery, tr } from "@/content/property"
import { SectionHeading } from "./section-heading"

// Φάση 2: προσθήκη lightbox για προβολή σε πλήρη οθόνη
export function Gallery() {
  const t = useTranslations("Gallery")
  const locale = useLocale() as Locale

  return (
    <section id="gallery" className="container-page py-10 sm:py-24">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      {/* Κινητό: οριζόντιο σύρσιμο (1 σειρά αντί για 6)· από tablet ομοιόμορφο πλέγμα (12 = 3×4, 4×3) */}
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-4">
        {gallery.map((img, i) => (
          <li
            key={img.src}
            className="group relative aspect-[4/5] w-[62%] shrink-0 snap-center overflow-hidden rounded-2xl bg-muted sm:w-auto"
          >
            <Image
              src={img.src}
              alt={tr(img.alt, locale)}
              fill
              sizes="(min-width: 1152px) 280px, (min-width: 640px) 33vw, 50vw"
              priority={i < 4}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
