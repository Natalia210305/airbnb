import { ArrowLeftIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import type { LegalDoc } from "@/content/legal"
import { tr } from "@/content/property"

/** Κοινή διάταξη για τις νομικές σελίδες (Πολιτική απορρήτου, Όροι κράτησης) */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const t = useTranslations("Legal")
  const locale = useLocale() as Locale

  return (
    <div className="container-page py-10 sm:py-16">
      <article className="max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {t("back")}
        </Link>
        <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">
          {tr(doc.title, locale)}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{tr(doc.updated, locale)}</p>
        <p className="mt-6 text-muted-foreground">{tr(doc.intro, locale)}</p>

        {doc.sections.map((section, i) => (
          <section key={i} className="mt-8">
            <h2 className="text-xl font-semibold">{tr(section.title, locale)}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed sm:text-base">
              {section.blocks.map((block, j) =>
                block.type === "p" ? (
                  <p key={j}>{tr(block.text, locale)}</p>
                ) : (
                  <ul key={j} className="list-disc space-y-2 pl-5">
                    {block.items.map((item, k) => (
                      <li key={k}>{tr(item, locale)}</li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </section>
        ))}
      </article>
    </div>
  )
}
