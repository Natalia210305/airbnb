import type { Metadata } from "next"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { termsOfBooking } from "@/content/legal"
import { property, tr } from "@/content/property"
import { LegalPage } from "@/components/legal/legal-page"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  return {
    title: `${tr(termsOfBooking.title, locale)} · ${property.shortName}`,
    alternates: {
      canonical: `/${locale}/terms`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/terms`])),
    },
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <LegalPage doc={termsOfBooking} />
}
