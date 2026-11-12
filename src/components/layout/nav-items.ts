import { amenityGroups } from "@/content/property"

/** Ενότητες της one-page αρχικής — το `id` αντιστοιχεί στο id του <section> */
export const navItems = [
  { id: "hospital", href: "/#hospital" },
  { id: "gallery", href: "/#gallery" },
  ...(amenityGroups.length
    ? [{ id: "amenities", href: "/#amenities" } as const]
    : []),
  { id: "location", href: "/#location" },
  { id: "booking", href: "/#booking" },
  { id: "reviews", href: "/#reviews" },
  { id: "faq", href: "/#faq" },
] as const

export const sectionIds = navItems.map((i) => i.id)
