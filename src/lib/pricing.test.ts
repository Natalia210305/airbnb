import { describe, expect, it } from "vitest"
import { quote, type PricingConfig } from "./pricing"

const holidays = { el: "Γιορτές", en: "Holidays" }
const config: PricingConfig = {
  basePerNight: 60,
  seasons: [{ from: "12-20", to: "01-06", perNight: 70, label: holidays }],
  cleaningFee: 20,
  minNights: 2,
  weeklyDiscountPct: 10,
  climateFee: { aprToOct: 8, novToMar: 2 },
}

describe("quote", () => {
  it("τιμολογεί απλή διαμονή με τέλος χαμηλής περιόδου", () => {
    const q = quote("2026-11-20", "2026-11-23", config)
    expect(q.nights).toBe(3)
    expect(q.accommodation).toBe(180)
    expect(q.climateFee).toBe(6)
    expect(q.cleaningFee).toBe(20)
    expect(q.discount).toBe(0)
    expect(q.total).toBe(206)
    expect(q.lines).toEqual([{ perNight: 60, nights: 3, season: null }])
  })

  it("χωρίζει τις νύχτες βασικής/εποχικής τιμής και «τυλίγει» το νέο έτος", () => {
    const q = quote("2026-12-18", "2027-01-08", config)
    expect(q.lines).toEqual([
      { perNight: 60, nights: 2, season: null }, // 18, 19 Δεκ
      { perNight: 70, nights: 18, season: holidays }, // 20 Δεκ – 6 Ιαν
      { perNight: 60, nights: 1, season: null }, // 7 Ιαν
    ])
    expect(q.nights).toBe(21)
  })

  it("εφαρμόζει εβδομαδιαία έκπτωση από 7 νύχτες", () => {
    const q = quote("2026-05-01", "2026-05-08", config)
    expect(q.accommodation).toBe(420)
    expect(q.discount).toBe(42)
    expect(q.climateFee).toBe(56) // 7 × 8 (Απρ–Οκτ)
    expect(q.total).toBe(420 - 42 + 20 + 56)
  })

  it("αλλάζει τέλος στο όριο Οκτωβρίου/Νοεμβρίου", () => {
    expect(quote("2026-10-31", "2026-11-02", config).climateFee).toBe(8 + 2)
  })

  it("σημειώνει διαμονή κάτω από το ελάχιστο", () => {
    expect(quote("2026-11-20", "2026-11-21", config).belowMinNights).toBe(true)
    expect(quote("2026-11-20", "2026-11-22", config).belowMinNights).toBe(false)
  })

  it("μηδενικές νύχτες → μηδενικό κόστος", () => {
    expect(quote("2026-11-20", "2026-11-20", config).total).toBe(0)
  })
})
