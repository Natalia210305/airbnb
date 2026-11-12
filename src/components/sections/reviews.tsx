import { ExternalLinkIcon, StarIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { formatRating, ratings } from "@/content/property"
import { SectionHeading } from "./section-heading"

/** Βαθμολογίες ανά πλατφόρμα, με σύνδεσμο προς τις κριτικές (οι ίδιες οι κριτικές δεν αναπαράγονται) */
export function Reviews() {
  const t = useTranslations("Reviews")
  const locale = useLocale() as Locale

  return (
    <section id="reviews" className="container-page py-10 sm:py-24">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-4 sm:grid-cols-2">
        {ratings.map((r) => (
          <div
            key={r.source}
            className="flex flex-col items-start gap-3 rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8"
          >
            <p className="font-heading text-5xl font-semibold">
              {formatRating(r.score, locale)}
              <span className="text-xl opacity-70">
                {" "}
                {t("outOf", { outOf: r.outOf })}
              </span>
            </p>
            <div className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-sm opacity-90">
              {t("source", { source: r.source })} ·{" "}
              {t("basedOn", { count: r.count })}
            </p>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-sm font-medium hover:bg-white/25"
            >
              {t("readAll", { source: r.source })}
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
