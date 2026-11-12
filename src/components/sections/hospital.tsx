import {
  BriefcaseMedicalIcon,
  CalendarClockIcon,
  CarIcon,
  FootprintsIcon,
  HeartHandshakeIcon,
  HospitalIcon,
  MoonIcon,
  NavigationIcon,
  SquareParkingIcon,
  TreesIcon,
} from "lucide-react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { fullAddress, locationPhotos, tr } from "@/content/property"
import { hospital } from "@/content/distances"
import { ScrollLink } from "@/components/layout/scroll-link"
import { buttonVariants } from "@/components/ui/button"
import { mapsLinks } from "@/components/location/place-meta"
import { SectionHeading } from "./section-heading"

const km = (m: number, locale: Locale) =>
  (m / 1000).toLocaleString(locale === "el" ? "el-GR" : "en-GB", {
    maximumFractionDigits: 1,
  })

export function Hospital() {
  const t = useTranslations("Hospital")
  const locale = useLocale() as Locale

  const audiences = [
    {
      icon: HeartHandshakeIcon,
      title: t("companionsTitle"),
      text: t("companionsText"),
    },
    {
      icon: BriefcaseMedicalIcon,
      title: t("staffTitle"),
      text: t("staffText"),
    },
    {
      icon: CalendarClockIcon,
      title: t("patientsTitle"),
      text: t("patientsText"),
    },
    { icon: TreesIcon, title: t("leisureTitle"), text: t("leisureText") },
  ]

  return (
    <section id="hospital" className="container-page py-10 sm:py-24">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Κάρτα νοσοκομείου */}
        <div className="flex flex-col gap-6 rounded-3xl border border-[#d6343b]/25 bg-gradient-to-br from-[#d6343b]/[0.07] to-transparent p-4 sm:p-6">
          <div className="flex items-start gap-4 px-1 sm:px-2">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#d6343b] text-white shadow-lg">
              <HospitalIcon className="size-7" />
            </span>
            <p className="font-heading text-xl leading-snug font-semibold">
              {t("cardTitle")}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-3">
            {locationPhotos.map((img) => (
              <li
                key={img.src}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted"
              >
                <Image
                  src={img.src}
                  alt={tr(img.alt, locale)}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 300px, 45vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-3 px-1 sm:px-2">
            <Stat
              icon={FootprintsIcon}
              value={t("minutes", { min: hospital.walkMin })}
              label={`${t("walk")} · ${t("km", { km: km(hospital.walkMeters, locale) })}`}
            />
            <Stat
              icon={CarIcon}
              value={t("minutes", { min: hospital.driveMin })}
              label={`${t("drive")} · ${t("km", { km: km(hospital.driveMeters, locale) })}`}
            />
          </div>

          <ul className="space-y-2.5 px-1 text-sm sm:px-2">
            <li className="flex items-center gap-3">
              <SquareParkingIcon className="size-5 shrink-0 text-primary" />
              {t("parking")}
            </li>
            <li className="flex items-center gap-3">
              <MoonIcon className="size-5 shrink-0 text-primary" />
              {t("quiet")}
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-2 px-1 sm:px-2">
            <ScrollLink
              href="/#location"
              className={buttonVariants({
                size: "lg",
                className: "h-11 px-4",
              })}
            >
              {t("route")}
            </ScrollLink>
            <a
              href={mapsLinks.directions(
                fullAddress(locale),
                hospital,
                "driving",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "h-11 gap-2 px-4",
              })}
            >
              <NavigationIcon className="size-4" />
              {t("directions")}
            </a>
          </div>
        </div>

        {/* Για ποιους */}
        <div className="flex flex-col">
          <p className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {t("forWhom")}
          </p>
          <ul className="-mx-4 flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:grid-rows-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0">
            {audiences.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex w-[78%] shrink-0 snap-center flex-col rounded-2xl border border-border bg-card p-5 sm:w-auto sm:p-6"
              >
                <Icon className="mb-3 size-6 text-primary" />
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
}) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <Icon className="mb-2 size-5 text-[#d6343b]" />
      <p className="font-heading text-3xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
