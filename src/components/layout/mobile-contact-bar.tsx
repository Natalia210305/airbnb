"use client"

import { CalendarDaysIcon, PhoneIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { contactLinks } from "@/lib/contact"
import { WhatsAppIcon } from "@/components/booking/booking-widget"
import { ScrollLink } from "./scroll-link"

/** Σταθερή μπάρα στο κάτω μέρος σε κινητά/tablet: άμεση κλήση, WhatsApp, κράτηση */
export function MobileContactBar() {
  const t = useTranslations("Contact")
  const item =
    "flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.7rem] font-medium"

  return (
    <nav
      aria-label={t("book")}
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <a href={contactLinks.tel} className={item}>
        <PhoneIcon className="size-5 text-primary" />
        {t("call")}
      </a>
      <a
        href={contactLinks.whatsapp()}
        target="_blank"
        rel="noopener noreferrer"
        className={item}
      >
        <WhatsAppIcon className="size-5 text-[#1fa855]" />
        {t("whatsapp")}
      </a>
      <ScrollLink
        href="/#booking"
        className={`${item} bg-primary text-primary-foreground`}
      >
        <CalendarDaysIcon className="size-5" />
        {t("book")}
      </ScrollLink>
    </nav>
  )
}
