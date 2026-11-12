"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  CarIcon,
  FootprintsIcon,
  LoaderCircleIcon,
  NavigationIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { fullAddress, property, tr } from "@/content/property"
import { hospitalRoute, places, propertyLocation } from "@/content/distances"
import { cn } from "@/lib/utils"
import { mapsLinks, placeMeta } from "./place-meta"

const LocationMap = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => <MapLoading />,
})

function MapLoading() {
  const t = useTranslations("Location")
  return (
    <div className="grid size-full place-items-center bg-muted">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircleIcon className="size-4 animate-spin" />
        {t("loadingMap")}
      </p>
    </div>
  )
}

export function LocationExplorer() {
  const t = useTranslations("Location")
  const locale = useLocale() as Locale
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const address = fullAddress(locale)
  // Η σειρά ακολουθεί το distances.json (πρώτο το νοσοκομείο)
  const list = places.map((p) => ({ ...p, label: tr(p.name, locale) }))

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div
        role="region"
        aria-label={t("mapLabel")}
        className="relative isolate h-[300px] overflow-hidden rounded-3xl border border-border sm:h-[520px] lg:h-full lg:min-h-[560px]"
      >
        <LocationMap
          home={{
            lat: propertyLocation.lat,
            lng: propertyLocation.lng,
            label: property.name,
            address,
          }}
          places={list}
          route={hospitalRoute}
          routeLabel={t("hospitalRoute")}
          walkLabel={t("walk")}
          driveLabel={t("drive")}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {propertyLocation.approximate && (
          <p className="absolute right-3 bottom-8 left-3 z-[1000] w-fit rounded-lg bg-amber-50/95 px-3 py-1.5 text-xs text-amber-900 shadow">
            {t("approximate")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
          <div>
            <p className="text-xs opacity-80">{t("here")}</p>
            <p className="font-medium">{address}</p>
          </div>
          <a
            href={mapsLinks.place(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-xs font-medium hover:bg-white/25"
          >
            {t("openMaps")}
          </a>
        </div>

        <ul className="flex flex-col gap-2">
          {list.map((p) => {
            const isHospital = p.kind === "hospital"
            const active = selectedId === p.id
            return (
              <li
                key={p.id}
                className={cn(
                  "rounded-2xl border bg-card transition-colors",
                  isHospital
                    ? "border-[#d6343b]/40 bg-[#d6343b]/[0.04]"
                    : "border-border",
                  active && "ring-2 ring-primary",
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(active ? null : p.id)}
                  aria-pressed={active}
                  aria-label={`${t("showOnMap")}: ${p.label}`}
                  className="flex w-full items-center gap-3 p-3 text-left"
                >
                  <PlaceIcon kind={p.kind} />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-sm",
                        isHospital ? "font-semibold" : "font-medium",
                      )}
                    >
                      {p.label}
                    </span>
                    {p.detail && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {p.detail}
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-0.5 text-xs tabular-nums">
                    <span
                      className="flex items-center gap-1"
                      title={t("drive")}
                    >
                      <CarIcon className="size-3.5 text-muted-foreground" />
                      <span className="sr-only">{t("drive")}</span>
                      {t("minutes", { min: p.driveMin })}
                    </span>
                    <span
                      className="flex items-center gap-1 text-muted-foreground"
                      title={t("walk")}
                    >
                      <FootprintsIcon className="size-3.5" />
                      <span className="sr-only">{t("walk")}</span>
                      {t("minutes", { min: p.walkMin })}
                    </span>
                  </span>
                </button>
                {active && (
                  <div className="flex gap-2 px-3 pb-3">
                    {(["driving", "walking"] as const).map((mode) => (
                      <a
                        key={mode}
                        href={mapsLinks.directions(address, p, mode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted"
                      >
                        <NavigationIcon className="size-3.5" />
                        {t("directions")} ·{" "}
                        {mode === "driving" ? t("drive") : t("walk")}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
        <p className="text-xs text-muted-foreground">{t("note")}</p>
      </div>
    </div>
  )
}

function PlaceIcon({ kind }: { kind: keyof typeof placeMeta }) {
  const { icon: Icon, color } = placeMeta[kind]
  return (
    <span
      aria-hidden
      className="grid size-10 shrink-0 place-items-center rounded-xl"
      style={{ background: `${color}1a`, color }}
    >
      <Icon className="size-5" />
    </span>
  )
}
