"use client"

import { Suspense, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { CameraControls } from "@react-three/drei"
import { Box3, Vector3 } from "three"
import { CAMERA_FOV, tour, type TourRoom } from "@/content/tour"
import { PlanModel } from "./plan-model"

const isDev = process.env.NODE_ENV === "development"

/** DOM στοιχεία (κουμπιά) των σημείων ενδιαφέροντος, ανά id χώρου */
export type HotspotElements = Map<string, HTMLElement>

export type TourSceneProps = {
  /** Τα κουμπιά ζουν έξω από το Canvas· η σκηνή απλώς τα μετακινεί σε κάθε frame */
  hotspots: React.RefObject<HotspotElements>
  selectedId: string | null
  onReady: () => void
  reducedMotion: boolean
  /** false όταν το Hero δεν φαίνεται στην οθόνη → σταματά το rendering */
  active: boolean
}

export default function TourScene({
  hotspots,
  selectedId,
  onReady,
  reducedMotion,
  active,
}: TourSceneProps) {
  const selected = tour.rooms.find((r) => r.id === selectedId)

  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{
        position: tour.defaultView.position,
        fov: CAMERA_FOV,
        near: 0.1,
        far: 120,
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <hemisphereLight args={["#fff8ef", "#cdb89d", 1.25]} />
      <directionalLight
        position={[7, 16, 11]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.03}
      >
        {/* Η κάτοψη είναι μακρόστενη (17 × 8 μ.) → ευρύτερο πεδίο σκιών */}
        <orthographicCamera
          attach="shadow-camera"
          args={[-13, 13, 11, -11, 0.5, 60]}
        />
      </directionalLight>

      <Suspense fallback={null}>
        <group onDoubleClick={isDev ? logPoint : undefined}>
          <PlanModel />
        </group>
        <Ready onReady={onReady} />
      </Suspense>

      <HotspotProjector hotspots={hotspots} />

      <Controls selected={selected} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

/** Καλείται όταν έχει φορτώσει το μοντέλο (μετά το Suspense) */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady])
  return null
}

/**
 * Προβάλλει τη 3D θέση κάθε σημείου ενδιαφέροντος στην οθόνη και μετακινεί
 * το αντίστοιχο κουμπί (απλό DOM, χωρίς επιπλέον React roots).
 */
function HotspotProjector({
  hotspots,
}: {
  hotspots: React.RefObject<HotspotElements>
}) {
  const v = useRef(new Vector3())
  useFrame(({ camera, size }) => {
    for (const room of tour.rooms) {
      const el = hotspots.current.get(room.id)
      if (!el) continue
      v.current.set(...room.hotspot).project(camera)
      const behind = v.current.z > 1
      const x = (v.current.x * 0.5 + 0.5) * size.width
      const y = (-v.current.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      el.style.visibility = behind ? "hidden" : "visible"
    }
  })
  return null
}

function Controls({
  selected,
  reducedMotion,
}: {
  selected: TourRoom | undefined
  reducedMotion: boolean
}) {
  const ref = useRef<CameraControls>(null)
  const autoRotate = useRef(true)
  const isFirst = useRef(true)
  const size = useThree((s) => s.size)
  const viewport = useRef({ width: size.width, height: size.height })
  viewport.current = { width: size.width, height: size.height }
  // Νέα προσαρμογή κάμερας μόνο όταν αλλάζει αισθητά το μέγεθος του viewer
  // (στροφή κινητού, πλήρης οθόνη), όχι σε κάθε pixel
  const sizeKey = `${Math.round(size.width / 48)}x${Math.round(size.height / 48)}`

  useEffect(() => {
    // Κρατάει το σημείο εστίασης κοντά στο διαμέρισμα (όχι «χάσιμο» με pan)
    ref.current?.setBoundary(
      new Box3(new Vector3(-10, 0, -6), new Vector3(10, 3, 6)),
    )
  }, [])

  useEffect(() => {
    const controls = ref.current
    if (!controls) return
    if (selected) autoRotate.current = false
    if (viewport.current.width <= 0 || viewport.current.height <= 0) return
    const view = selected
      ? tour.roomView(selected, viewport.current)
      : tour.overviewView(viewport.current)
    void controls.setLookAt(
      ...view.position,
      ...view.target,
      !reducedMotion && !isFirst.current,
    )
    isFirst.current = false
  }, [selected, reducedMotion, sizeKey])

  useFrame((_, delta) => {
    if (autoRotate.current && !reducedMotion) {
      void ref.current?.rotate(delta * 0.1, 0, false)
    }
  })

  return (
    <CameraControls
      ref={ref}
      makeDefault
      smoothTime={0.6}
      minDistance={3}
      maxDistance={60}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2.35}
      onStart={() => {
        autoRotate.current = false
      }}
      onEnd={isDev ? () => logView(ref.current) : undefined}
    />
  )
}

/* ── Βοηθήματα μόνο για development: αντιγράψτε τις τιμές στο src/content/tour.ts ── */

const fmt = (v: Vector3) =>
  `[${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}]`

function logPoint(e: ThreeEvent<MouseEvent>) {
  e.stopPropagation()
  console.info(`[tour] hotspot: ${fmt(e.point)}`)
}

function logView(controls: CameraControls | null) {
  if (!controls) return
  const position = controls.getPosition(new Vector3())
  const target = controls.getTarget(new Vector3())
  console.info(
    `[tour] view: { position: ${fmt(position)}, target: ${fmt(target)} }`,
  )
}
