#!/usr/bin/env node
/**
 * Υπολογίζει αποστάσεις/χρόνους (με τα πόδια & με αυτοκίνητο) από το κατάλυμα
 * προς τα σημεία ενδιαφέροντος και γράφει το src/content/distances.json.
 *
 *   npm run distances
 *
 * Πηγές (δωρεάν, χωρίς κλειδί API):
 *  - Δρομολόγηση: routing.openstreetmap.de (OSRM, FOSSGIS)
 *  - Αναζήτηση κοντινών (σούπερ μάρκετ, φαρμακείο, στάση): nominatim.openstreetmap.org
 *
 * Τρέξτε το ξανά κάθε φορά που αλλάζουν οι συντεταγμένες στο src/content/location.json.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const root = new URL("..", import.meta.url)
const inputPath = fileURLToPath(new URL("src/content/location.json", root))
const outputPath = fileURLToPath(new URL("src/content/distances.json", root))
const UA = "short-stay-site/1.0 (distance precompute)"

/** Περιθώριο για κίνηση/στάθμευση: το OSRM δίνει ιδανικούς χρόνους οδήγησης */
const DRIVE_FACTOR = 1.4
const DRIVE_EXTRA_MIN = 1

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function haversine(a, b) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  return res.json()
}

async function route(profile, from, to, withGeometry = false) {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`
  const overview = withGeometry ? "simplified&geometries=geojson" : "false"
  const data = await getJson(
    `https://routing.openstreetmap.de/routed-${profile}/route/v1/driving/${coords}?overview=${overview}`,
  )
  const r = data.routes?.[0]
  if (!r) throw new Error(`No ${profile} route to ${to.lat},${to.lng}`)
  return r
}

async function findNearest(query, near) {
  for (const d of [0.008, 0.016]) {
    const params = new URLSearchParams({
      format: "jsonv2",
      q: query,
      limit: "15",
      bounded: "1",
      "accept-language": "el",
      viewbox: `${near.lng - d},${near.lat + d},${near.lng + d},${near.lat - d}`,
    })
    const results = await getJson(
      `https://nominatim.openstreetmap.org/search?${params}`,
    )
    await sleep(1100) // όριο χρήσης Nominatim: 1 αίτημα/δευτερόλεπτο
    if (results.length) {
      return results
        .map((r) => ({ lat: +r.lat, lng: +r.lon, osmName: r.name || "" }))
        .sort((a, b) => haversine(near, a) - haversine(near, b))[0]
    }
  }
  return null
}

const input = JSON.parse(readFileSync(inputPath, "utf8"))
const home = input.property
const places = input.landmarks.map((l) => ({ ...l }))

for (const s of input.nearbySearch) {
  const hit = await findNearest(s.query, home)
  if (!hit) {
    console.warn(`⚠ Δεν βρέθηκε: ${s.query}`)
    continue
  }
  places.push({
    id: s.id,
    kind: s.kind,
    name: s.label,
    detail: hit.osmName || undefined,
    lat: hit.lat,
    lng: hit.lng,
  })
}

let hospitalRoute = []
for (const p of places) {
  const isHospital = p.kind === "hospital"
  const foot = await route("foot", home, p, isHospital)
  const car = await route("car", home, p)
  p.walkMeters = Math.round(foot.distance)
  p.walkMin = Math.max(1, Math.ceil(foot.duration / 60))
  p.driveMeters = Math.round(car.distance)
  p.driveMin = Math.max(
    1,
    Math.ceil((car.duration / 60) * DRIVE_FACTOR + DRIVE_EXTRA_MIN),
  )
  if (isHospital) {
    hospitalRoute = foot.geometry.coordinates.map(([lng, lat]) => [
      +lat.toFixed(5),
      +lng.toFixed(5),
    ])
  }
  console.log(
    `${p.id.padEnd(12)} 🚶 ${String(p.walkMin).padStart(3)}′ (${p.walkMeters} m)   🚗 ${String(p.driveMin).padStart(2)}′ (${p.driveMeters} m)${p.detail ? "  · " + p.detail : ""}`,
  )
  await sleep(300)
}

const output = {
  $comment:
    "ΠΑΡΑΓΕΤΑΙ ΑΥΤΟΜΑΤΑ από το scripts/compute-distances.mjs — μην το επεξεργάζεστε με το χέρι",
  generatedAt: new Date().toISOString().slice(0, 10),
  property: { lat: home.lat, lng: home.lng },
  places,
  hospitalRoute,
}
writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n")
console.log(`\n✓ ${outputPath}`)
