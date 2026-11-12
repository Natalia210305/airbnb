"use client"

import { createElement, useEffect, useMemo, useRef } from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"
import type { Place } from "@/content/distances"
import { placeMeta } from "./place-meta"

export type MapPlace = Place & { label: string }

export type LocationMapProps = {
  home: { lat: number; lng: number; label: string; address: string }
  places: MapPlace[]
  route: [number, number][]
  routeLabel: string
  walkLabel: string
  driveLabel: string
  selectedId: string | null
  onSelect: (id: string | null) => void
}

/** Αποδίδει ένα εικονίδιο lucide σε SVG string (για τα HTML pins του Leaflet) */
function iconSvg(kind: keyof typeof placeMeta, size: number) {
  const el = document.createElement("div")
  const root = createRoot(el)
  flushSync(() =>
    root.render(
      createElement(placeMeta[kind].icon, {
        size,
        color: "#fff",
        strokeWidth: 2.25,
      }),
    ),
  )
  const svg = el.innerHTML
  root.unmount()
  return svg
}

function pin(kind: keyof typeof placeMeta, big = false) {
  const { color } = placeMeta[kind]
  const size = big ? 46 : 36
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 6],
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 6px 16px rgba(0,0,0,.25);display:grid;place-items:center"><span style="transform:rotate(45deg);display:grid">${iconSvg(kind, big ? 22 : 17)}</span></div>`,
  })
}

// Δημιουργούνται μία φορά, εκτός React render (το module φορτώνεται μόνο στον browser)
const pins = {
  home: pin("home", true),
  ...(Object.fromEntries(
    (Object.keys(placeMeta) as (keyof typeof placeMeta)[])
      .filter((k) => k !== "home")
      .map((k) => [k, pin(k)]),
  ) as Record<Exclude<keyof typeof placeMeta, "home">, L.DivIcon>),
}

export default function LocationMap({
  home,
  places,
  route,
  routeLabel,
  walkLabel,
  driveLabel,
  selectedId,
  onSelect,
}: LocationMapProps) {
  const markers = useRef(new Map<string, L.Marker>())
  const bounds = useMemo(
    () =>
      L.latLngBounds([
        [home.lat, home.lng],
        ...places.map((p) => [p.lat, p.lng] as [number, number]),
      ]),
    [home, places],
  )

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [36, 36] }}
      scrollWheelZoom={false}
      className="size-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route.length > 1 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: "#d6343b",
            weight: 5,
            opacity: 0.8,
            dashArray: "2 10",
            lineCap: "round",
          }}
        >
          <Popup>{routeLabel}</Popup>
        </Polyline>
      )}
      <Marker
        position={[home.lat, home.lng]}
        icon={pins.home}
        zIndexOffset={1000}
        ref={(m) => {
          if (m) markers.current.set("home", m)
        }}
        eventHandlers={{ click: () => onSelect(null) }}
      >
        <Popup>
          <strong>{home.label}</strong>
          <br />
          {home.address}
        </Popup>
      </Marker>
      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={pins[p.kind]}
          zIndexOffset={p.kind === "hospital" ? 500 : 0}
          ref={(m) => {
            if (m) markers.current.set(p.id, m)
          }}
          eventHandlers={{ click: () => onSelect(p.id) }}
        >
          <Popup>
            <strong>{p.label}</strong>
            {p.detail && (
              <>
                <br />
                {p.detail}
              </>
            )}
            <br />
            {walkLabel}: {p.walkMin}′ · {driveLabel}: {p.driveMin}′
          </Popup>
        </Marker>
      ))}
      <MapBehaviour bounds={bounds} selectedId={selectedId} markers={markers} />
    </MapContainer>
  )
}

/** Εστίαση στο επιλεγμένο σημείο + ροδέλα zoom μόνο αφού κάνει κλικ ο χρήστης στον χάρτη */
function MapBehaviour({
  bounds,
  selectedId,
  markers,
}: {
  bounds: L.LatLngBounds
  selectedId: string | null
  markers: React.RefObject<Map<string, L.Marker>>
}) {
  const map = useMap()

  useEffect(() => {
    const enable = () => map.scrollWheelZoom.enable()
    const disable = () => map.scrollWheelZoom.disable()
    map.on("click", enable)
    map.on("mouseout", disable)
    // Σε οθόνες αφής, το σύρσιμο με ένα δάχτυλο κάνει scroll στη σελίδα (zoom με δύο δάχτυλα)
    if (window.matchMedia("(pointer: coarse)").matches) map.dragging.disable()
    return () => {
      map.off("click", enable)
      map.off("mouseout", disable)
    }
  }, [map])

  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const marker = selectedId ? markers.current.get(selectedId) : null
    if (marker) {
      const target = marker.getLatLng()
      const home = markers.current.get("home")?.getLatLng()
      // Δείχνουμε μαζί κατάλυμα + προορισμό
      map.flyToBounds(L.latLngBounds([target, home ?? target]), {
        padding: [60, 60],
        maxZoom: 17,
        duration: 0.8,
      })
      map.once("moveend", () => marker.openPopup())
    } else {
      map.flyToBounds(bounds, { padding: [36, 36], duration: 0.8 })
    }
  }, [selectedId, map, bounds, markers])

  return null
}
