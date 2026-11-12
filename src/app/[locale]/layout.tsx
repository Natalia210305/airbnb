import type { Metadata } from "next"
import { Comfortaa, Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { fullAddress, property, tr } from "@/content/property"
import { propertyLocation } from "@/content/distances"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { MobileContactBar } from "@/components/layout/mobile-contact-bar"
import "../globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "greek"],
  display: "swap",
})

// Στρογγυλή, παιχνιδιάρικη γραμματοσειρά τίτλων (υποστηρίζει ελληνικά)
const display = Comfortaa({
  variable: "--font-display",
  subsets: ["latin", "greek"],
  display: "swap",
})

// Η τελική διεύθυνση του site (canonical, Open Graph, δομημένα δεδομένα). Σειρά προτεραιότητας:
// 1) NEXT_PUBLIC_SITE_URL, 2) η διεύθυνση παραγωγής στο Vercel, 3) τοπικά το localhost
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: "Metadata" })
  const values = { name: property.name, slogan: tr(property.slogan, locale) }
  const title = t("title", values)
  const description = t("description", values)

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: t("keywords"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      siteName: property.name,
      title,
      description,
      locale: locale === "el" ? "el_GR" : "en_GB",
      url: `/${locale}`,
      images: [
        {
          url: property.heroImage.src,
          width: property.heroImage.width,
          height: property.heroImage.height,
        },
      ],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${display.variable} flex min-h-dvh flex-col antialiased`}
      >
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <MobileContactBar />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(lodgingJsonLd(locale)).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      </body>
    </html>
  )
}

/** Δομημένα δεδομένα (schema.org) για το Google */
function lodgingJsonLd(locale: "el" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.name,
    slogan: tr(property.slogan, locale),
    description: tr(property.summary, locale),
    url: `${siteUrl}/${locale}`,
    telephone: property.contact.phoneE164,
    image: `${siteUrl}${property.heroImage.src}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: tr(property.address.street, locale),
      addressLocality: tr(property.address.city, locale),
      postalCode: property.address.postalCode,
      addressCountry: property.address.countryCode,
    },
    // Μόνο όταν οι συντεταγμένες είναι οι ακριβείς
    ...(!propertyLocation.approximate && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: propertyLocation.lat,
        longitude: propertyLocation.lng,
      },
    }),
    sameAs: [property.bookingUrl, property.airbnbUrl],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(locale))}`,
    ...(property.checkIn && { checkinTime: property.checkIn }),
    ...(property.checkOut && { checkoutTime: property.checkOut }),
  }
}
