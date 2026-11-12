import { describe, expect, it } from "vitest"
import { CAMERA_FOV, tour, type CameraView, type Vec3 } from "./tour"

/** Προβολή σημείου στην οθόνη (px), ανεξάρτητη υλοποίηση από την προσαρμογή κάμερας */
function toScreen(view: CameraView, p: Vec3, w: number, h: number) {
  const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
  const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const cross = (a: Vec3, b: Vec3): Vec3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
  const norm = (a: Vec3): Vec3 => {
    const l = Math.hypot(...a)
    return [a[0] / l, a[1] / l, a[2] / l]
  }
  const f = norm(sub(view.target, view.position))
  const r = norm(cross(f, [0, 1, 0]))
  const u = cross(r, f)
  const rel = sub(p, view.position)
  const z = dot(rel, f)
  const tan = Math.tan((CAMERA_FOV * Math.PI) / 360)
  const ndcX = dot(rel, r) / (z * tan * (w / h))
  const ndcY = dot(rel, u) / (z * tan)
  return { x: (ndcX * 0.5 + 0.5) * w, y: (-ndcY * 0.5 + 0.5) * h, z }
}

const viewports = [
  { name: "κινητό", width: 358, height: 520 },
  { name: "μικρό κινητό", width: 296, height: 480 },
  { name: "desktop", width: 606, height: 640 },
  { name: "πλήρης οθόνη", width: 1920, height: 1080 },
]

describe("προσαρμογή κάμερας της 3D κάτοψης", () => {
  for (const vp of viewports) {
    it(`πανοραμική (${vp.name}): όλη η κάτοψη και τα pins χωράνε στην οθόνη`, () => {
      const view = tour.overviewView(vp)
      const { x1, x2, z1, z2 } = tour.plan
      for (const [x, z] of [[x1, z1], [x2, z1], [x2, z2], [x1, z2]]) {
        const s = toScreen(view, tour.toScene(x, 0, z), vp.width, vp.height)
        expect(s.z).toBeGreaterThan(0)
        expect(s.x).toBeGreaterThanOrEqual(0)
        expect(s.x).toBeLessThanOrEqual(vp.width)
        expect(s.y).toBeGreaterThanOrEqual(0)
        expect(s.y).toBeLessThanOrEqual(vp.height)
      }
      for (const room of tour.rooms) {
        const s = toScreen(view, room.hotspot, vp.width, vp.height)
        // ολόκληρη η ετικέτα του pin (≈ 104 × 34 px) μέσα στο πλαίσιο
        expect(s.x - 52).toBeGreaterThanOrEqual(0)
        expect(s.x + 52).toBeLessThanOrEqual(vp.width)
        expect(s.y - 17).toBeGreaterThanOrEqual(0)
        expect(s.y + 17).toBeLessThanOrEqual(vp.height)
      }
    })

    it(`κάθε δωμάτιο (${vp.name}): φαίνεται ολόκληρο πάνω από την κάρτα πληροφοριών`, () => {
      for (const room of tour.rooms) {
        const view = tour.roomView(room, vp)
        const bottomUi = 188
        const { x1, x2, z1, z2 } = room.rect
        for (const [x, z] of [[x1, z1], [x2, z1], [x2, z2], [x1, z2]]) {
          const s = toScreen(view, tour.toScene(x, 0, z), vp.width, vp.height)
          expect(s.x, `${room.id} x`).toBeGreaterThanOrEqual(0)
          expect(s.x, `${room.id} x`).toBeLessThanOrEqual(vp.width)
          expect(s.y, `${room.id} y (κάτω από το πάνω μενού)`).toBeGreaterThanOrEqual(110)
          expect(s.y, `${room.id} y (πάνω από την κάρτα)`).toBeLessThanOrEqual(
            vp.height - bottomUi + 6,
          )
        }
      }
    })
  }
})
