import { ExternalLinkIcon, MapPinIcon, PhoneIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { fullAddress, property, tr } from "@/content/property"
import { contactLinks } from "@/lib/contact"
import { mapsLinks } from "@/components/location/place-meta"
import { WhatsAppIcon } from "@/components/booking/booking-widget"

export function SiteFooter() {
  const t = useTranslations("Footer")
  const locale = useLocale() as Locale
  const address = fullAddress(locale)

  return (
    <footer className="border-t border-border bg-secondary/50 pb-20 lg:pb-0">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="font-heading text-xl font-semibold">{property.name}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {tr(property.slogan, locale)}
          </p>
          {property.amaNumber && (
            <p className="text-xs text-muted-foreground">
              {t("license", { number: property.amaNumber })}
            </p>
          )}
        </div>
        <div className="space-y-3 text-sm sm:justify-self-end">
          <p className="font-medium">{t("contact")}</p>
          <a
            href={contactLinks.tel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <PhoneIcon className="size-4" /> {property.contact.phoneDisplay}
          </a>
          <a
            href={contactLinks.whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <WhatsAppIcon className="size-4" /> WhatsApp / Viber
          </a>
          <a
            href={mapsLinks.place(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <MapPinIcon className="size-4" /> {address}
          </a>
          <a
            href={property.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ExternalLinkIcon className="size-4" /> Booking.com
          </a>
          <a
            href={property.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ExternalLinkIcon className="size-4" /> Airbnb
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t("rights", {
              year: new Date().getFullYear(),
              name: property.name,
            })}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
