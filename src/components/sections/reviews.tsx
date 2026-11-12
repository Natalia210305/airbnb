import { ExternalLinkIcon, StarIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { property, reviews, tr } from "@/content/property"
import { SectionHeading } from "./section-heading"

export function Reviews() {
  const t = useTranslations("Reviews")
  const locale = useLocale() as Locale
  const { score, outOf, source } = property.rating
  const scoreText = score.toLocaleString(locale === "el" ? "el-GR" : "en-GB", {
    minimumFractionDigits: 1,
  })

  return (
    <section id="reviews" className="container-page py-10 sm:py-24">
      <SectionHeading title={t("title")} />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8">
          <div>
            <p className="font-heading text-6xl font-semibold">
              {scoreText}
              <span className="text-2xl opacity-70">
                {" "}
                {t("outOf", { outOf })}
              </span>
            </p>
            <div className="mt-2 flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className="size-5 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-sm opacity-90">{t("source", { source })}</p>
          </div>
          <a
            href={`${property.bookingUrl}#tab-reviews`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-sm font-medium hover:bg-white/25"
          >
            {t("readAll", { source })}
            <ExternalLinkIcon className="size-3.5" />
          </a>
        </div>

        {reviews.map((r) => (
          <figure
            key={r.name}
            className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6"
          >
            <blockquote className="flex-1 text-base">
              “{tr(r.text, locale)}”
            </blockquote>
            <figcaption className="text-sm">
              <span className="font-medium">{r.name}</span>
              <span className="text-muted-foreground">
                {" "}
                · {tr(r.from, locale)}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
