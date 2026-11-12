"use client"

import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import {
  BoxIcon,
  ExpandIcon,
  ImagesIcon,
  Maximize2Icon,
  LoaderCircleIcon,
  Rotate3dIcon,
  ShrinkIcon,
  XIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { gallery, property, tr, type Photo } from "@/content/property"
import { tour } from "@/content/tour"
import { cn } from "@/lib/utils"
import { PhotoLightbox } from "./photo-lightbox"
import { PhotoViewer } from "./photo-viewer"
import type { HotspotElements } from "./tour-scene"

// Το Three.js φορτώνεται μόνο στον browser, ξεχωριστά από το υπόλοιπο site
const TourScene = dynamic(() => import("./tour-scene"), { ssr: false })

type Mode = "plan" | "photos"

export function ApartmentTour({ className }: { className?: string }) {
  const t = useTranslations("Tour")
  const locale = useLocale() as Locale
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [requestedMode, setMode] = useState<Mode>("plan")
  // Αν δεν υποστηρίζεται το WebGL, μένει διαθέσιμη η προβολή φωτογραφιών
  const mode: Mode = failed ? "photos" : requestedMode
  const plan = mode === "plan"
  const reducedMotion = usePrefersReducedMotion()
  const visible = useIsVisible(containerRef)
  const { canFullscreen, isFullscreen, toggleFullscreen } =
    useFullscreen(containerRef)

  const labels = useMemo(
    () =>
      Object.fromEntries(tour.rooms.map((r) => [r.id, tr(r.label, locale)])),
    [locale],
  )
  const selected = tour.rooms.find((r) => r.id === selectedId)
  // Πραγματικές φωτογραφίες του επιλεγμένου χώρου (από το gallery του property.ts)
  const roomPhotos: Photo[] = selected
    ? selected.photos.flatMap((src) => gallery.find((p) => p.src === src) ?? [])
    : []
  // Το lightbox ανήκει στον χώρο που το άνοιξε· αλλαγή χώρου το κλείνει αυτόματα
  const [lightboxFor, setLightboxFor] = useState<string | null>(null)
  const lightboxOpen = !!selected && lightboxFor === selected.id
  const handleReady = useCallback(() => setReady(true), [])
  const hotspots = useRef<HotspotElements>(new Map())

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={t("label")}
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-[#e6ebd9] via-[#f4f2e7] to-[#e9e6d3] shadow-[0_30px_80px_-30px_rgba(60,85,55,0.35)] dark:from-stone-800 dark:via-stone-900 dark:to-stone-950",
        isFullscreen && "rounded-none border-0",
        className,
      )}
    >
      {!failed && (
        <SceneErrorBoundary onError={() => setFailed(true)}>
          <div
            className={cn(
              "absolute inset-0 cursor-grab active:cursor-grabbing",
              !plan && "pointer-events-none invisible",
            )}
          >
            <TourScene
              hotspots={hotspots}
              selectedId={selectedId}
              onReady={handleReady}
              reducedMotion={reducedMotion}
              active={visible && plan}
            />
          </div>
        </SceneErrorBoundary>
      )}

      {/* 3D φωτογραφίες */}
      {mode === "photos" && (
        <div className="absolute inset-0 z-10">
          <PhotoViewer reducedMotion={reducedMotion} />
        </div>
      )}

      {/* Σημεία ενδιαφέροντος (κουμπιά): τα μετακινεί η 3D σκηνή σε κάθε frame.
          Εστιάζονται και με πληκτρολόγιο· η επιστροφή στην πανοραμική γίνεται με το «X» της κάρτας. */}
      {ready && !failed && plan && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {tour.rooms.map((room) => (
            <Hotspot
              key={room.id}
              ref={(el) => {
                if (el) hotspots.current.set(room.id, el)
                else hotspots.current.delete(room.id)
              }}
              label={labels[room.id]}
              active={room.id === selectedId}
              onClick={() => setSelectedId(room.id)}
            />
          ))}
        </div>
      )}

      {/* Φόρτωση */}
      {!ready && !failed && plan && (
        <div className="absolute inset-0 z-[25] grid place-items-center">
          <PosterImage locale={locale} blurred />
          <p className="relative flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-medium text-stone-800 shadow-lg">
            <LoaderCircleIcon className="size-4 animate-spin" />
            {t("loading")}
          </p>
        </div>
      )}

      {/* Πάνω μπάρα */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-3 sm:p-4">
        <div className="flex min-w-0 flex-col items-start gap-1.5">
          {/* Εναλλαγή προβολής */}
          <div
            role="group"
            aria-label={t("modeLabel")}
            className="pointer-events-auto flex rounded-full bg-white/90 p-1 shadow-sm backdrop-blur-sm"
          >
            <ModeButton
              active={plan}
              disabled={failed}
              title={failed ? t("unsupported") : undefined}
              onClick={() => setMode("plan")}
            >
              <BoxIcon className="size-3.5" />
              {t("modePlan")}
            </ModeButton>
            <ModeButton active={!plan} onClick={() => setMode("photos")}>
              <ImagesIcon className="size-3.5" />
              {t("modePhotos")}
            </ModeButton>
          </div>
          <p className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm backdrop-blur-sm">
            <Rotate3dIcon className="size-4 shrink-0 text-primary" />
            <span className="hidden sm:inline">
              {plan ? t("hint") : t("photoHint")}
            </span>
            <span className="sm:hidden">
              {plan ? t("hintTouch") : t("photoHintTouch")}
            </span>
          </p>
          {/* Η κάτοψη είναι πραγματική· η επίπλωση είναι ενδεικτική */}
          {plan && (
            <p className="rounded-full bg-stone-900/70 px-2.5 py-1 text-[0.7rem] text-white/90 backdrop-blur-sm">
              {t("illustrative")}
            </p>
          )}
        </div>
        {canFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="pointer-events-auto grid size-9 place-items-center rounded-full bg-white/85 text-stone-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            {isFullscreen ? (
              <ShrinkIcon className="size-4" />
            ) : (
              <ExpandIcon className="size-4" />
            )}
            <span className="sr-only">
              {isFullscreen ? t("exitFullscreen") : t("fullscreen")}
            </span>
          </button>
        )}
      </div>

      {/* Κάτω: κάρτα πληροφοριών του χώρου που επιλέχθηκε (μόνο στην κάτοψη) */}
      {plan && (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col gap-3 p-3 sm:p-4">
        {selected && (
          <div
            aria-live="polite"
            className="pointer-events-auto relative flex max-w-sm animate-in gap-3 rounded-2xl bg-white/92 p-3 pr-10 text-stone-800 shadow-xl backdrop-blur-md duration-300 fade-in slide-in-from-bottom-2"
          >
            {roomPhotos[0] && (
              <button
                type="button"
                onClick={() => setLightboxFor(selected.id)}
                aria-label={t("enlargePhoto", { room: labels[selected.id] })}
                className="group relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl bg-stone-200 sm:w-28"
              >
                <Image
                  src={roomPhotos[0].src}
                  alt={tr(roomPhotos[0].alt, locale)}
                  fill
                  sizes="112px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <span className="absolute right-1.5 bottom-1.5 grid size-6 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                  <Maximize2Icon className="size-3" />
                </span>
              </button>
            )}
            <div className="min-w-0 py-1">
              <p className="font-heading text-lg font-semibold">
                {labels[selected.id]}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {tr(selected.description, locale)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="absolute top-3 right-3 grid size-7 place-items-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            >
              <XIcon className="size-4" />
              <span className="sr-only">{t("close")}</span>
            </button>
          </div>
        )}
      </div>
      )}

      {lightboxOpen && selected && roomPhotos.length > 0 && (
        <PhotoLightbox
          photos={roomPhotos}
          title={labels[selected.id]}
          onClose={() => setLightboxFor(null)}
        />
      )}
    </div>
  )
}

function Hotspot({
  label,
  active,
  ...props
}: { label: string; active: boolean } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-pressed={active}
      style={{ visibility: "hidden" }}
      className={cn(
        "pointer-events-auto absolute top-0 left-0 flex items-center gap-2 rounded-full py-1.5 pr-3 pl-2 text-xs font-medium whitespace-nowrap shadow-lg ring-1 backdrop-blur-sm transition-colors duration-200 will-change-transform select-none focus-visible:ring-2 focus-visible:ring-primary",
        active
          ? "bg-primary text-primary-foreground ring-primary"
          : "bg-white/90 text-stone-800 ring-black/5 hover:bg-white",
      )}
      {...props}
    >
      <span className="relative flex size-2.5">
        {!active && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
        )}
        <span
          className={cn(
            "relative inline-flex size-2.5 rounded-full",
            active ? "bg-white" : "bg-primary",
          )}
        />
      </span>
      {label}
    </button>
  )
}

function ModeButton({
  active,
  children,
  ...props
}: { active: boolean; children: ReactNode } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-45",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-stone-600 hover:text-stone-900",
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function PosterImage({
  locale,
  blurred,
}: {
  locale: Locale
  blurred?: boolean
}) {
  return (
    <Image
      src={property.heroImage.src}
      alt={blurred ? "" : tr(property.heroImage.alt, locale)}
      fill
      priority
      sizes="(min-width: 1024px) 60vw, 100vw"
      className={cn("object-cover", blurred && "scale-110 opacity-40 blur-xl")}
    />
  )
}

/** Αν η συσκευή δεν υποστηρίζει WebGL, δείχνουμε φωτογραφία αντί για σφάλμα */
class SceneErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.hasError ? null : this.props.children
  }
}

/* ── hooks ─────────────────────────────────────────────────────────────── */

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  )
}

function useIsVisible(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return visible
}

function useFullscreen(ref: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canFullscreen = useSyncExternalStore(
    () => () => {},
    () => document.fullscreenEnabled,
    () => false,
  )
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === ref.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [ref])
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void ref.current?.requestFullscreen?.()
  }, [ref])
  return { canFullscreen, isFullscreen, toggleFullscreen }
}
