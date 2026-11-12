/**
 * Ημερομηνίες ως απλά strings "YYYY-MM-DD" (χωρίς ώρα/ζώνη ώρας), ώστε μια
 * «νύχτα» να είναι ίδια σε server, browser και iCal.
 */
export type ISODate = string

const pad = (n: number) => String(n).padStart(2, "0")

/** Date (τοπική ώρα browser) → "YYYY-MM-DD" */
export function toISODate(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** "YYYY-MM-DD" → Date στα μεσάνυχτα τοπικής ώρας */
export function fromISODate(s: ISODate): Date {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(s: ISODate, days: number): ISODate {
  const [y, m, d] = s.split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + days))
  return dt.toISOString().slice(0, 10)
}

/** Πλήθος νυχτών από check-in έως check-out */
export function nightsBetween(checkIn: ISODate, checkOut: ISODate): number {
  const a = Date.parse(`${checkIn}T00:00:00Z`)
  const b = Date.parse(`${checkOut}T00:00:00Z`)
  return Math.round((b - a) / 86_400_000)
}

/** Οι νύχτες μιας διαμονής: [checkIn, checkOut) */
export function eachNight(checkIn: ISODate, checkOut: ISODate): ISODate[] {
  const n = nightsBetween(checkIn, checkOut)
  return Array.from({ length: Math.max(0, n) }, (_, i) => addDays(checkIn, i))
}
