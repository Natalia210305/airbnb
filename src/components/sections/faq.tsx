import { ChevronDownIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { faq, property, tr } from "@/content/property"
import { hospital } from "@/content/distances"
import { SectionHeading } from "./section-heading"

export function Faq() {
  const t = useTranslations("Faq")
  const locale = useLocale() as Locale
  const km = (hospital.driveMeters / 1000).toLocaleString(
    locale === "el" ? "el-GR" : "en-GB",
    { maximumFractionDigits: 1 },
  )

  const items = [
    {
      q: t("hospitalQ"),
      a: t("hospitalA", {
        drive: hospital.driveMin,
        walk: hospital.walkMin,
        km,
      }),
    },
    { q: t("companionsQ"), a: t("companionsA") },
    ...(property.checkIn && property.checkOut
      ? [
          {
            q: t("checkInQ"),
            a: t("checkInA", {
              checkIn: property.checkIn,
              checkOut: property.checkOut,
            }),
          },
        ]
      : []),
    ...faq.map((f) => ({ q: tr(f.q, locale), a: tr(f.a, locale) })),
  ]

  // Δομημένα δεδομένα FAQ για το Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  }

  return (
    <section id="faq" className="container-page py-10 sm:py-24">
      <SectionHeading title={t("title")} />
      <div className="max-w-3xl divide-y divide-border rounded-2xl border border-border">
        {items.map((item, i) => (
          <details
            key={item.q}
            open={i === 0}
            className="group px-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium">
              {item.q}
              <ChevronDownIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-5 text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  )
}
