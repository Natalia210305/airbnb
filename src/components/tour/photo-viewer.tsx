"use client"

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { gallery, tr } from "@/content/property"
import { cn } from "@/lib/utils"

const photos = gallery
const MAX_TILT = 9 // μοίρες
const SWIPE_PX = 45

/**
 * Φωτογραφίες σε διαδραστική 3D προβολή (coverflow): η ενεργή φωτογραφία
 * γέρνει (tilt) ακολουθώντας το ποντίκι ή το δάχτυλο και οι διπλανές φαίνονται
 * σε βάθος. Σύρσιμο/βέλη/πληκτρολόγιο αλλάζουν φωτογραφία.
 */
export function PhotoViewer({ reducedMotion }: { reducedMotion: boolean }) {
  const t = useTranslations("Tour")
  const locale = useLocale() as Locale
  const [index, setIndex] = useState(0)
  const n = photos.length
  const tiltRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)
  /** Μετά από σύρσιμο, το κλικ που ακολουθεί δεν πρέπει να επιλέγει φωτογραφία */
  const suppressClick = useRef(false)

  const go = (delta: number) => setIndex((i) => (i + delta + n) % n)

  /** Σχετική θέση της φωτογραφίας i ως προς την ενεργή, κυκλικά: [-n/2, n/2) */
  const offsetOf = (i: number) => ((i - index + n + Math.floor(n / 2)) % n) - Math.floor(n / 2)

  const updateTilt = (e: ReactPointerEvent) => {
    const el = tiltRef.current
    if (!el || reducedMotion) return
    const r = el.getBoundingClientRect()
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    el.style.setProperty("--ry", `${((px - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`)
    el.style.setProperty("--rx", `${((0.5 - py) * 2 * MAX_TILT).toFixed(2)}deg`)
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`)
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`)
    el.style.setProperty("--glare", "1")
  }

  const resetTilt = () => {
    const el = tiltRef.current
    if (!el) return
    for (const k of ["--rx", "--ry"]) el.style.setProperty(k, "0deg")
    el.style.setProperty("--glare", "0")
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={t("photosLabel")}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1)
        else if (e.key === "ArrowRight") go(1)
      }}
      className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-inset"
    >
      <div
        className="absolute inset-0 touch-pan-y overflow-hidden [perspective:1400px]"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, moved: false }
        }}
        onPointerMove={(e) => {
          updateTilt(e)
          if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) {
            drag.current.moved = true
          }
        }}
        onPointerUp={(e) => {
          const d = drag.current
          drag.current = null
          if (!d) return
          const dx = e.clientX - d.x
          if (d.moved) {
            suppressClick.current = true
            setTimeout(() => (suppressClick.current = false), 0)
          }
          if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1)
        }}
        onPointerLeave={resetTilt}
        onPointerCancel={() => {
          drag.current = null
          resetTilt()
        }}
      >
        {photos.map((photo, i) => {
          const off = offsetOf(i)
          const abs = Math.abs(off)
          const active = off === 0
          return (
            <div
              key={photo.src}
              ref={active ? tiltRef : undefined}
              aria-hidden={!active}
              className={cn(
                "absolute top-[55%] left-1/2 aspect-[4/5] h-[64%] sm:h-[68%]",
                !reducedMotion &&
                  "transition-[transform,opacity] duration-500 ease-out",
                abs > 2 ? "pointer-events-none" : "cursor-pointer",
              )}
              style={{
                zIndex: 10 - abs,
                opacity: abs > 2 ? 0 : 1 - abs * 0.22,
                transform: `translate(-50%, -50%) translateX(${off * 56}%) translateZ(${-abs * 200}px) rotateY(${active ? 0 : -Math.sign(off) * 50}deg)`,
              }}
              onClick={() => {
                if (suppressClick.current) return
                if (!active) setIndex(i)
              }}
            >
              {/* Στρώμα tilt: μόνο η ενεργή φωτογραφία γέρνει */}
              <div
                className="relative size-full overflow-hidden rounded-2xl bg-muted shadow-[0_30px_60px_-20px_rgba(40,60,40,0.55)] ring-1 ring-black/10 transition-transform duration-150 ease-out will-change-transform"
                style={
                  active
                    ? {
                        transform:
                          "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
                      }
                    : undefined
                }
              >
                <Image
                  src={photo.src}
                  alt={tr(photo.alt, locale)}
                  fill
                  sizes="(min-width: 1024px) 380px, 70vw"
                  draggable={false}
                  className="pointer-events-none object-cover"
                />
                {active && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[var(--glare,0)] mix-blend-soft-light transition-opacity duration-200"
                    style={{
                      background:
                        "radial-gradient(circle at var(--gx, 50%) var(--gy, 30%), rgba(255,255,255,0.75), transparent 60%)",
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Κάτω: βέλη + λεζάντα */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-3 p-3 sm:p-4">
        <ArrowButton label={t("prev")} onClick={() => go(-1)}>
          <ChevronLeftIcon className="size-5" />
        </ArrowButton>
        <p
          aria-live="polite"
          className="max-w-[60%] rounded-full bg-white/90 px-4 py-2 text-center text-xs font-medium text-stone-800 shadow-sm backdrop-blur-sm sm:text-sm"
        >
          {tr(photos[index].alt, locale)}
          <span className="ml-2 text-stone-500 tabular-nums">
            {index + 1}/{n}
          </span>
        </p>
        <ArrowButton label={t("next")} onClick={() => go(1)}>
          <ChevronRightIcon className="size-5" />
        </ArrowButton>
      </div>
    </div>
  )
}

function ArrowButton({
  label,
  children,
  ...props
}: { label: string } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      className="pointer-events-auto grid size-10 shrink-0 place-items-center rounded-full bg-white/90 text-stone-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
      {...props}
    >
      {children}
    </button>
  )
}
