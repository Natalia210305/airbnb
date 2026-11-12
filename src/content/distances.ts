import { travelTimes, type Localized } from "./property"
import data from "./distances.json"
import location from "./location.json"

export type PlaceKind =
  "hospital" | "center" | "lake" | "castle" | "supermarket" | "pharmacy" | "bus"

export type Place = {
  id: string
  kind: PlaceKind
  name: Localized
  /** π.χ. όνομα καταστήματος από το OpenStreetMap */
  detail?: string
  lat: number
  lng: number
  walkMin: number
  walkMeters: number
  driveMin: number
  driveMeters: number
}

export const propertyLocation = location.property
/** Αυτόματοι χρόνοι (OSRM) + οι χειροκίνητοι του property.ts, που υπερισχύουν */
export const places = (data.places as Place[]).map((p) => ({
  ...p,
  ...travelTimes[p.id],
}))
export const hospitalRoute = data.hospitalRoute as [number, number][]
export const hospital = places.find((p) => p.kind === "hospital")!

if (
  process.env.NODE_ENV === "development" &&
  (data.property.lat !== location.property.lat ||
    data.property.lng !== location.property.lng)
) {
  console.warn(
    "[distances] Οι συντεταγμένες άλλαξαν — τρέξτε `npm run distances` για να ενημερωθούν οι αποστάσεις.",
  )
}
