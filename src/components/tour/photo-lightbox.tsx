"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { tr, type Photo } from "@/content/property"

/**
 * Μεγάλη προβολή φωτογραφιών σε πλήρη οθόνη. Κλείνει με Esc, κλικ στο φόντο ή το κουμπί·
 * τα βέλη (οθόνη ή πληκτρολόγιο) αλλάζουν φωτογραφία.
 * Αν ο viewer είναι σε πλήρη οθόνη, το lightbox μπαίνει μέσα στο στοιχείο πλήρους οθόνης,
 * αλλιώς δεν θα φαινόταν.
 */
export function PhotoLightbox({
  photos,
  title,
  onClose,
}: {
  photos: Photo[]
  title: string
  onClose: () => void
}) {
  const t = useTranslations("Tour")
  const locale = useLocale() as Locale
  const [index, setIndex] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const n = photos.length

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + n) % n)
      else if (e.key === "ArrowRight") setIndex((i) => (i + 1) % n)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [n, onClose])

  const photo = photos[index]
  const host = document.fullscreenElement ?? document.body

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex animate-in flex-col bg-black/85 backdrop-blur-sm duration-200 fade-in"
    >
      <div className="flex items-center justify-between gap-3 p-4 text-white">
        <p className="font-heading text-lg font-semibold">{title}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-full bg-white/15 hover:bg-white/25"
        >
          <XIcon className="size-5" />
          <span className="sr-only">{t("closePhoto")}</span>
        </button>
      </div>

      <div className="relative mx-4 min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
        <Image
          key={photo.src}
          src={photo.src}
          alt={tr(photo.alt, locale)}
          fill
          sizes="100vw"
          className="animate-in object-contain duration-300 fade-in"
        />
      </div>

      <div
        className="flex items-center justify-center gap-3 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {n > 1 && (
          <LightboxArrow
            label={t("prev")}
            onClick={() => setIndex((i) => (i - 1 + n) % n)}
          >
            <ChevronLeftIcon className="size-5" />
          </LightboxArrow>
        )}
        <p className="max-w-[60%] rounded-full bg-white/90 px-4 py-2 text-center text-xs font-medium text-stone-800 sm:text-sm">
          {tr(photo.alt, locale)}
          {n > 1 && (
            <span className="ml-2 text-stone-500 tabular-nums">
              {index + 1}/{n}
            </span>
          )}
        </p>
        {n > 1 && (
          <LightboxArrow label={t("next")} onClick={() => setIndex((i) => (i + 1) % n)}>
            <ChevronRightIcon className="size-5" />
          </LightboxArrow>
        )}
      </div>
    </div>,
    host,
  )
}

function LightboxArrow({
  label,
  children,
  ...props
}: { label: string } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-10 shrink-0 place-items-center rounded-full bg-white/90 text-stone-700 transition-colors hover:bg-white"
      {...props}
    >
      {children}
    </button>
  )
}
