import {
  BusIcon,
  CastleIcon,
  HospitalIcon,
  HouseIcon,
  LandmarkIcon,
  PillIcon,
  ShoppingCartIcon,
  WavesIcon,
  type LucideIcon,
} from "lucide-react"
import type { PlaceKind } from "@/content/distances"

/** Εικονίδιο και χρώμα ανά τύπο σημείου */
export const placeMeta: Record<
  PlaceKind | "home",
  { icon: LucideIcon; color: string }
> = {
  home: { icon: HouseIcon, color: "#4f7a57" },
  hospital: { icon: HospitalIcon, color: "#d6343b" },
  center: { icon: LandmarkIcon, color: "#5b6b7a" },
  lake: { icon: WavesIcon, color: "#2f7fb5" },
  castle: { icon: CastleIcon, color: "#7b5b3a" },
  supermarket: { icon: ShoppingCartIcon, color: "#b4692a" },
  pharmacy: { icon: PillIcon, color: "#2e9a6e" },
  bus: { icon: BusIcon, color: "#c48a1a" },
}

const enc = encodeURIComponent

export const mapsLinks = {
  place: (address: string) =>
    `https://www.google.com/maps/search/?api=1&query=${enc(address)}`,
  directions: (
    originAddress: string,
    to: { lat: number; lng: number },
    mode: "walking" | "driving",
  ) =>
    `https://www.google.com/maps/dir/?api=1&origin=${enc(originAddress)}&destination=${to.lat},${to.lng}&travelmode=${mode}`,
}
