import { addDays, eachNight, type ISODate } from "./dates"

/**
 * Ελαφρύς parser για τα iCal (.ics) που εξάγουν Booking.com / Airbnb.
 * Επιστρέφει τις κρατημένες νύχτες: κάθε VEVENT καλύπτει [DTSTART, DTEND).
 */
export function parseBookedNights(ics: string): ISODate[] {
  // «Ξεδίπλωμα» γραμμών (RFC 5545: γραμμή που ξεκινά με κενό συνεχίζει την προηγούμενη)
  const lines = ics.replace(/\r?\n[ \t]/g, "").split(/\r?\n/)
  const nights = new Set<ISODate>()
  let start: ISODate | null = null
  let end: ISODate | null = null
  let inEvent = false

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true
      start = end = null
    } else if (line === "END:VEVENT") {
      if (inEvent && start) {
        const until = end && end > start ? end : addDays(start, 1)
        for (const n of eachNight(start, until)) nights.add(n)
      }
      inEvent = false
    } else if (inEvent && line.startsWith("DTSTART")) {
      start = parseIcsDate(line)
    } else if (inEvent && line.startsWith("DTEND")) {
      end = parseIcsDate(line)
    }
  }
  return [...nights].sort()
}

/** "DTSTART;VALUE=DATE:20261120" ή "DTSTART:20261120T140000Z" → "2026-11-20" */
function parseIcsDate(line: string): ISODate | null {
  const m = line.slice(line.indexOf(":") + 1).match(/^(\d{4})(\d{2})(\d{2})/)
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null
}
