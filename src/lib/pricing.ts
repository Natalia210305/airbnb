import { eachNight, type ISODate } from "./dates"
import type { Localized } from "@/content/property"

export type PricingConfig = {
  basePerNight: number
  seasons: { from: string; to: string; perNight: number; label: Localized }[]
  cleaningFee: number
  minNights: number
  weeklyDiscountPct: number
  climateFee: { aprToOct: number; novToMar: number }
}

export type RateLine = {
  perNight: number
  nights: number
  /** null = βασική τιμή */
  season: Localized | null
}

export type Quote = {
  nights: number
  lines: RateLine[]
  accommodation: number
  discount: number
  cleaningFee: number
  climateFee: number
  total: number
  belowMinNights: boolean
}

/** Ταιριάζει το "MM-DD" της νύχτας σε εποχή from–to (υποστηρίζει αλλαγή έτους) */
function inSeason(mmdd: string, from: string, to: string) {
  return from <= to ? mmdd >= from && mmdd <= to : mmdd >= from || mmdd <= to
}

export function rateForNight(night: ISODate, config: PricingConfig) {
  const mmdd = night.slice(5)
  const season = config.seasons.find((s) => inSeason(mmdd, s.from, s.to))
  return season
    ? { perNight: season.perNight, season: season.label }
    : { perNight: config.basePerNight, season: null }
}

export function climateFeeForNight(night: ISODate, config: PricingConfig) {
  const month = Number(night.slice(5, 7))
  return month >= 4 && month <= 10
    ? config.climateFee.aprToOct
    : config.climateFee.novToMar
}

const round2 = (n: number) => Math.round(n * 100) / 100

/** Υπολογίζει το κόστος διαμονής για check-in → check-out */
export function quote(
  checkIn: ISODate,
  checkOut: ISODate,
  config: PricingConfig,
): Quote {
  const nights = eachNight(checkIn, checkOut)
  const lines: RateLine[] = []
  let accommodation = 0
  let climateFee = 0

  for (const night of nights) {
    const { perNight, season } = rateForNight(night, config)
    accommodation += perNight
    climateFee += climateFeeForNight(night, config)
    const last = lines.at(-1)
    if (last && last.perNight === perNight && last.season === season)
      last.nights++
    else lines.push({ perNight, season, nights: 1 })
  }

  const discount =
    nights.length >= 7
      ? round2((accommodation * config.weeklyDiscountPct) / 100)
      : 0
  const cleaningFee = nights.length > 0 ? config.cleaningFee : 0

  return {
    nights: nights.length,
    lines,
    accommodation,
    discount,
    cleaningFee,
    climateFee,
    total: round2(accommodation - discount + cleaningFee + climateFee),
    belowMinNights: nights.length < config.minNights,
  }
}
