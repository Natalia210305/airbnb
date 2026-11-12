import { describe, expect, it } from "vitest"
import { parseBookedNights } from "./ical"

const ics = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "BEGIN:VEVENT",
  "DTSTART;VALUE=DATE:20261120",
  "DTEND;VALUE=DATE:20261123",
  "SUMMARY:CLOSED - Not available",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "DTSTART:20261130T140000Z",
  "DTEND:20261202T100000Z",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "DTSTART;VALUE=DATE:20261221",
  "SUMMARY:Χωρίς DTEND → μία νύχτα",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n")

describe("parseBookedNights", () => {
  it("επιστρέφει τις νύχτες [DTSTART, DTEND) ταξινομημένες", () => {
    expect(parseBookedNights(ics)).toEqual([
      "2026-11-20",
      "2026-11-21",
      "2026-11-22",
      "2026-11-30",
      "2026-12-01",
      "2026-12-21",
    ])
  })

  it("χειρίζεται «διπλωμένες» γραμμές", () => {
    const folded =
      "BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:2026\r\n 1105\r\nDTEND;VALUE=DATE:20261106\r\nEND:VEVENT"
    expect(parseBookedNights(folded)).toEqual(["2026-11-05"])
  })
})
