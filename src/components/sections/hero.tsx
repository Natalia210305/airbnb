import {
  BathIcon,
  BedDoubleIcon,
  DoorOpenIcon,
  HospitalIcon,
  MessageCircleIcon,
  MoonIcon,
  PhoneIcon,
  SquareParkingIcon,
  StarIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { formatPrice, pricing, property, tr } from "@/content/property"
import { hospital } from "@/content/distances"
import { contactLinks } from "@/lib/contact"
import { buttonVariants } from "@/components/ui/button"
import { ScrollLink } from "@/components/layout/scroll-link"
import { ApartmentTour } from "@/components/tour/apartment-tour"

export function Hero() {
  const t = useTranslations("Hero")
  const locale = useLocale() as Locale
  const { capacity, rating } = property

  // Χωρητικότητα (όσα είναι γνωστά) + τα βασικά πλεονεκτήματα, έως 4 κάρτες
  const capacityFacts: { icon: LucideIcon; label: string }[] = [
    capacity.guests && {
      icon: UsersIcon,
      label: t("guests", { count: capacity.guests }),
    },
    capacity.bedrooms && {
      icon: DoorOpenIcon,
      label: t("bedrooms", { count: capacity.bedrooms }),
    },
    capacity.beds && {
      icon: BedDoubleIcon,
      label: t("beds", { count: capacity.beds }),
    },
    capacity.baths && {
      icon: BathIcon,
      label: t("baths", { count: capacity.baths }),
    },
  ].filter((f) => !!f)
  const highlights = [
    {
      icon: HospitalIcon,
      label: t("hospitalFact", { walk: hospital.walkMin }),
    },
    { icon: SquareParkingIcon, label: t("parkingFact") },
    { icon: MoonIcon, label: t("quietFact") },
    { icon: MessageCircleIcon, label: t("contactFact") },
  ]
  const facts = [...capacityFacts, ...highlights].slice(0, 4)

  return (
    <section className="relative isolate overflow-hidden">
      {/* διακοσμητικό φόντο */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 size-[32rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 size-[28rem] rounded-full bg-accent/60 blur-3xl" />
      </div>

      {/*
        Κινητό: κείμενο → 3D → χαρακτηριστικά (το 3D φαίνεται νωρίς).
        Desktop: κείμενο & χαρακτηριστικά αριστερά, 3D δεξιά.
      */}
      <div className="container-page grid gap-5 pt-5 pb-4 sm:gap-8 sm:pt-12 sm:pb-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_auto] lg:gap-x-12 lg:gap-y-6 lg:pt-16">
        <div className="flex flex-col gap-4 sm:gap-6 lg:self-end">
          <div className="flex flex-wrap gap-2">
            <p className="flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <StarIcon className="size-3.5 fill-primary text-primary" />
              {t("rating", {
                score: rating.score.toFixed(1),
                source: rating.source,
              })}
            </p>
            <ScrollLink
              href="/#hospital"
              className="flex items-center gap-1.5 rounded-full bg-[#d6343b] px-3 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#b82a30]"
            >
              <HospitalIcon className="size-3.5" />
              {t("hospitalBadge", { walk: hospital.walkMin })}
            </ScrollLink>
          </div>
          <h1 className="text-2xl leading-[1.2] font-bold sm:text-4xl xl:text-5xl">
            {tr(property.tagline, locale)}
          </h1>
          <p className="line-clamp-3 max-w-xl text-sm text-muted-foreground sm:line-clamp-none sm:text-lg">
            {tr(property.summary, locale)}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ScrollLink
              href="/#booking"
              className={buttonVariants({
                size: "lg",
                className: "h-12 px-6 text-base",
              })}
            >
              {t("cta")}
            </ScrollLink>
            <a
              href={contactLinks.tel}
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "h-12 gap-2 px-6 text-base",
              })}
            >
              <PhoneIcon className="size-4" />
              {t("call", { phone: property.contact.phoneDisplay })}
            </a>
          </div>
          {!pricing.isPlaceholder && (
            <p className="-mt-2 text-sm text-muted-foreground">
              {t("fromPrice", {
                price: formatPrice(pricing.basePerNight, locale),
              })}
            </p>
          )}
        </div>

        <ApartmentTour className="h-[min(62svh,460px)] sm:h-[540px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[640px]" />

        <ul className="grid grid-cols-2 gap-3 lg:self-start">
          {facts.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm backdrop-blur-sm"
            >
              <Icon className="size-5 shrink-0 text-primary" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
