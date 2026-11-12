import { addDays, toISODate } from "@/lib/dates"
import { parseBookedNights } from "@/lib/ical"

/** Ανανέωση κάθε 30′ (ISR) — τα iCal των πλατφορμών ενημερώνονται αργά ούτως ή άλλως */
export const revalidate = 1800

/**
 * Κλεισμένες νύχτες από τα iCal των πλατφορμών.
 * Ορίστε στο .env.local:  ICAL_URLS=https://...booking...ics,https://...airbnb...ics
 * (Booking.com extranet → Τιμές & Διαθεσιμότητα → Συγχρονισμός ημερολογίων → Εξαγωγή)
 */
export async function GET() {
  const urls = (process.env.ICAL_URLS ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean)

  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const res = await fetch(url, { next: { revalidate } })
      if (!res.ok) throw new Error(`${res.status} ${url}`)
      return parseBookedNights(await res.text())
    }),
  )

  const booked = new Set<string>()
  const yesterday = addDays(toISODate(new Date()), -1)
  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const night of r.value) if (night >= yesterday) booked.add(night)
    } else {
      console.error("[availability]", r.reason)
    }
  }

  return Response.json({
    booked: [...booked].sort(),
    /** false = δεν έχουν οριστεί iCal ή απέτυχαν όλα → η διαθεσιμότητα επιβεβαιώνεται χειροκίνητα */
    synced: urls.length > 0 && results.some((r) => r.status === "fulfilled"),
    updatedAt: new Date().toISOString(),
  })
}
