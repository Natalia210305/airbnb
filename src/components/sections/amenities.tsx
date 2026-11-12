"use client"

import { useState } from "react"
import {
  AirVentIcon,
  ArchiveIcon,
  ArmchairIcon,
  BabyIcon,
  BathIcon,
  BedDoubleIcon,
  BedIcon,
  BellRingIcon,
  BlindsIcon,
  BriefcaseMedicalIcon,
  BubblesIcon,
  Building2Icon,
  BuildingIcon,
  CalendarDaysIcon,
  CigaretteOffIcon,
  CoffeeIcon,
  CookingPotIcon,
  DoorOpenIcon,
  DropletsIcon,
  FireExtinguisherIcon,
  FlameIcon,
  FlowerIcon,
  HandshakeIcon,
  LanguagesIcon,
  LayoutGridIcon,
  MountainIcon,
  PlugIcon,
  RefrigeratorIcon,
  ShirtIcon,
  ShowerHeadIcon,
  SofaIcon,
  SquareParkingIcon,
  SunIcon,
  ThermometerSunIcon,
  TreesIcon,
  TvIcon,
  UtensilsCrossedIcon,
  UtensilsIcon,
  VolumeXIcon,
  WashingMachineIcon,
  WifiIcon,
  WindIcon,
  WineIcon,
  type LucideIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { amenityGroups, tr, type AmenityIcon } from "@/content/property"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./section-heading"

const icons: Record<AmenityIcon, LucideIcon> = {
  mountain: MountainIcon,
  city: Building2Icon,
  courtyard: TreesIcon,
  garden: FlowerIcon,
  hairdryer: WindIcon,
  soap: BubblesIcon,
  shower: ShowerHeadIcon,
  hotwater: DropletsIcon,
  washer: WashingMachineIcon,
  dryer: ThermometerSunIcon,
  hangers: ShirtIcon,
  bedlinen: BedDoubleIcon,
  pillows: BedIcon,
  blinds: BlindsIcon,
  iron: ShirtIcon,
  rack: SunIcon,
  wardrobe: ArchiveIcon,
  tv: TvIcon,
  ac: AirVentIcon,
  heating: FlameIcon,
  smoke: BellRingIcon,
  extinguisher: FireExtinguisherIcon,
  firstaid: BriefcaseMedicalIcon,
  wifi: WifiIcon,
  fridge: RefrigeratorIcon,
  cooking: CookingPotIcon,
  dishes: UtensilsCrossedIcon,
  stove: CookingPotIcon,
  coffee: CoffeeIcon,
  kettle: CoffeeIcon,
  wine: WineIcon,
  kitchenette: RefrigeratorIcon,
  dining: UtensilsIcon,
  entrance: DoorOpenIcon,
  outdoorfurniture: ArmchairIcon,
  outdoordining: UtensilsIcon,
  bbq: FlameIcon,
  parking: SquareParkingIcon,
  longstay: CalendarDaysIcon,
  host: HandshakeIcon,
  bath: BathIcon,
  socket: PlugIcon,
  crib: BabyIcon,
  sofa: SofaIcon,
  sofabed: SofaIcon,
  building: BuildingIcon,
  soundproof: VolumeXIcon,
  floor: LayoutGridIcon,
  nosmoking: CigaretteOffIcon,
  terrace: SunIcon,
  languages: LanguagesIcon,
}

/** Δεν εμφανίζεται όσο δεν υπάρχουν παροχές στο property.ts */
export function Amenities() {
  const t = useTranslations("Amenities")
  const locale = useLocale() as Locale
  // Κινητό: αρχικά μόνο οι πρώτες ομάδες (για να μη μακραίνει η σελίδα)
  const [expanded, setExpanded] = useState(false)
  if (amenityGroups.length === 0) return null
  const total = amenityGroups.reduce((n, g) => n + g.items.length, 0)
  const VISIBLE_ON_MOBILE = 4

  return (
    <section id="amenities" className="bg-secondary/50 py-10 sm:py-24">
      <div className="container-page">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        {/* Ομαδοποιημένες παροχές: κάρτες σε στήλες (masonry) */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {amenityGroups.map((group, i) => (
            <div
              key={group.id}
              className={cn(
                "break-inside-avoid rounded-2xl border border-border bg-card p-5",
                i >= VISIBLE_ON_MOBILE && !expanded && "hidden sm:block",
              )}
            >
              <h3 className="mb-3 text-base font-semibold">
                {tr(group.title, locale)}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map((a) => {
                  const Icon = icons[a.icon]
                  return (
                    <li
                      key={tr(a.label, "en")}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{tr(a.label, locale)}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-muted sm:hidden"
        >
          {expanded ? t("showLess") : t("showAll", { count: total })}
        </button>
      </div>
    </section>
  )
}
