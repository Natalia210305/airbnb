import { useTranslations } from "next-intl"
import { BookingWidget } from "@/components/booking/booking-widget"
import { SectionHeading } from "./section-heading"

export function Booking() {
  const t = useTranslations("Booking")
  return (
    <section id="booking" className="bg-secondary/50 py-10 sm:py-24">
      <div className="container-page">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <BookingWidget />
      </div>
    </section>
  )
}
