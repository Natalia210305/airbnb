import {
  BabyIcon,
  CigaretteOffIcon,
  ClockIcon,
  MoonIcon,
  PartyPopperIcon,
  PawPrintIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { houseRules, tr, type HouseRuleIcon } from "@/content/property"
import { SectionHeading } from "./section-heading"

const icons: Record<HouseRuleIcon, LucideIcon> = {
  checkin: ClockIcon,
  quiet: MoonIcon,
  smoking: CigaretteOffIcon,
  parties: PartyPopperIcon,
  pets: PawPrintIcon,
  children: UsersIcon,
  crib: BabyIcon,
}

/** Δεν εμφανίζεται όσο η λίστα κανόνων στο property.ts είναι κενή */
export function HouseRules() {
  const t = useTranslations("HouseRules")
  const locale = useLocale() as Locale
  if (houseRules.length === 0) return null

  return (
    <section id="rules" className="container-page py-10 sm:py-24">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <ul className="overflow-hidden rounded-2xl border border-border bg-card sm:grid sm:grid-cols-2">
        {houseRules.map((rule) => {
          const Icon = icons[rule.icon]
          return (
            <li
              key={rule.icon}
              className="flex gap-3 border-b border-border p-4 last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{tr(rule.title, locale)}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {tr(rule.text, locale)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
