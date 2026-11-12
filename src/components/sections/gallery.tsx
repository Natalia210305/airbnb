"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDownIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { gallery, tr } from "@/content/property"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./section-heading"

/**
 * Φωτογραφίες. Κινητό: οριζόντιο σύρσιμο με όλες τις φωτογραφίες.
 * Tablet/υπολογιστής: πλέγμα που δείχνει μόνο την πρώτη σειρά (3 φωτογραφίες σε tablet,
 * 4 σε υπολογιστή) και κουμπί-βέλος που εμφανίζει τις υπόλοιπες.
 */
export function Gallery() {
  const t = useTranslations("Gallery")
  const locale = useLocale() as Locale
  const [expanded, setExpanded] = useState(false)

  /** Κρυφές στην κλειστή κατάσταση, μόνο από tablet και πάνω (το κινητό τις δείχνει όλες) */
  const collapsedClass = (i: number) => {
    if (expanded || i < 3) return ""
    return i === 3 ? "sm:max-lg:hidden" : "sm:hidden"
  }

  return (
    <section id="gallery" className="container-page py-10 sm:py-24">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <ul
        id="gallery-grid"
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-4"
      >
        {gallery.map((img, i) => (
          <li
            key={img.src}
            className={cn(
              "group relative aspect-[4/5] w-[62%] shrink-0 snap-center overflow-hidden rounded-2xl bg-muted sm:w-auto",
              collapsedClass(i),
            )}
          >
            <Image
              src={img.src}
              alt={tr(img.alt, locale)}
              fill
              sizes="(min-width: 1152px) 280px, (min-width: 640px) 33vw, 62vw"
              priority={i < 4}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="gallery-grid"
        className="mx-auto mt-6 hidden items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted sm:flex"
      >
        {expanded
          ? t("showLess")
          : t("showAll", { count: gallery.length })}
        <ChevronDownIcon
          className={cn(
            "size-4 transition-transform duration-300",
            expanded && "rotate-180",
          )}
        />
      </button>
    </section>
  )
}
