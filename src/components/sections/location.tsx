import { useTranslations } from "next-intl"
import { LocationExplorer } from "@/components/location/location-explorer"
import { SectionHeading } from "./section-heading"

export function Location() {
  const t = useTranslations("Location")
  return (
    <section id="location" className="container-page py-10 sm:py-24">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <LocationExplorer />
    </section>
  )
}
