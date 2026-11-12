import { use } from "react"
import { setRequestLocale } from "next-intl/server"
import type { Locale } from "@/i18n/routing"
import { Hero } from "@/components/sections/hero"
import { Hospital } from "@/components/sections/hospital"
import { Gallery } from "@/components/sections/gallery"
import { Amenities } from "@/components/sections/amenities"
import { Location } from "@/components/sections/location"
import { Booking } from "@/components/sections/booking"
import { HouseRules } from "@/components/sections/house-rules"
import { Reviews } from "@/components/sections/reviews"
import { Faq } from "@/components/sections/faq"

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params) as { locale: Locale }
  setRequestLocale(locale)

  return (
    <>
      <Hero />
      <Hospital />
      <Gallery />
      <Amenities />
      <Location />
      <Booking />
      <HouseRules />
      <Reviews />
      <Faq />
    </>
  )
}
