"use client"

/**
 * Δάπεδα και ενδεικτικά έπιπλα (απλά γεωμετρικά σχήματα) μέσα στην κάτοψη του
 * Miranda's House. Οι θέσεις υπολογίζονται από τα ορθογώνια των δωματίων στο
 * src/content/tour.ts (συντεταγμένες κάτοψης σε μέτρα· x → ανατολή, z → νότος).
 *
 * Η (κοινόχρηστη) αυλή ΔΕΝ περιλαμβάνεται στο μοντέλο.
 */

import {
  bedroomLayout,
  entranceRect,
  rebuiltWalls,
  roomRects,
  type Opening,
  type Rect,
  type RebuiltWall,
  type Vec3,
} from "@/content/tour"

const C = {
  slab: "#cfc3b0",
  wood: "#d6b08a",
  woodDark: "#8a5a3b",
  woodLight: "#e6cfae",
  suitcase: "#5f7f8c",
  mirror: "#cfdde3",
  tile: "#ebe6de",
  tileDark: "#ddd6c9",
  white: "#fbf8f3",
  cream: "#efe6d8",
  stone: "#3a3633",
  wall: "#f5efe3",
  sofa: "#8d877b",
  rug: "#e5d8bd",
  bedThrow: "#9aa5b5",
  headboard: "#c9b79d",
  plant: "#6b8f4e",
  pot: "#c06a43",
  metal: "#3d3a36",
  glass: "#cfe6f0",
  screen: "#1f1d1b",
  fridge: "#2b2927",
}

type BoxProps = {
  size: Vec3
  position: Vec3
  color: string
  roughness?: number
  shadow?: boolean
}

function Box({ size, position, color, roughness = 0.8, shadow = true }: BoxProps) {
  return (
    <mesh position={position} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  )
}

function Cylinder({
  radius,
  height,
  position,
  color,
  radiusBottom = radius,
}: {
  radius: number
  height: number
  position: Vec3
  color: string
  radiusBottom?: number
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radiusBottom, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}

function Glass({ size, position }: { size: Vec3; position: Vec3 }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={C.glass}
        transparent
        opacity={0.25}
        roughness={0.05}
        metalness={0.1}
        depthWrite={false}
      />
    </mesh>
  )
}

function Plant({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <Cylinder radius={0.22} radiusBottom={0.16} height={0.4} position={[0, 0.2, 0]} color={C.pot} />
      <mesh position={[0, 0.78, 0]} castShadow>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color={C.plant} roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

/** Καρέκλα· η πλάτη της είναι προς -z. `rotationY` την στρέφει (π.χ. π → πλάτη προς νότο) */
function Chair({ x, z, rotationY = 0 }: { x: number; z: number; rotationY?: number }) {
  return (
    <group position={[x, 0, z]} rotation-y={rotationY}>
      <Box size={[0.42, 0.05, 0.42]} position={[0, 0.45, 0]} color={C.woodDark} />
      <Box size={[0.42, 0.45, 0.05]} position={[0, 0.68, -0.19]} color={C.woodDark} />
      <Box size={[0.36, 0.44, 0.36]} position={[0, 0.22, 0]} color={C.woodDark} />
    </group>
  )
}

/** Δάπεδο που καλύπτει ένα δωμάτιο */
function Floor({ rect, color }: { rect: Rect; color: string }) {
  const w = rect.x2 - rect.x1
  const d = rect.z2 - rect.z1
  return (
    <mesh position={[(rect.x1 + rect.x2) / 2, 0.01, (rect.z1 + rect.z2) / 2]} receiveShadow>
      <boxGeometry args={[w, 0.02, d]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  )
}

/* ── Υπνοδωμάτιο ──────────────────────────────────────────────────────── */

/**
 * Διπλό κρεβάτι· αρχικά το κεφαλάρι είναι προς βορρά (-z). Με `rotationY = π/2`
 * το κεφαλάρι πάει δυτικά (-x) και το κρεβάτι «κοιτάει» προς τα ανατολικά.
 */
function Bed({
  x,
  z,
  width = 1.6,
  rotationY = 0,
}: {
  x: number
  z: number
  width?: number
  rotationY?: number
}) {
  return (
    <group position={[x, 0, z]} rotation-y={rotationY}>
      <Box size={[width + 0.1, 0.35, 2.05]} position={[0, 0.175, 0]} color={C.woodDark} />
      <Box size={[width, 0.22, 1.95]} position={[0, 0.46, 0.02]} color={C.white} />
      <Box size={[width + 0.04, 0.08, 1.3]} position={[0, 0.6, 0.38]} color={C.bedThrow} />
      <Box size={[width + 0.2, 1.0, 0.1]} position={[0, 0.5, -1.03]} color={C.headboard} />
      {[-width / 4, width / 4].map((px) => (
        <Box key={px} size={[0.62, 0.14, 0.4]} position={[px, 0.64, -0.68]} color={C.cream} />
      ))}
    </group>
  )
}

function Bedroom() {
  const r = roomRects.bedroom
  const bedX = r.x1 + 1.08 // κεφαλάρι ακουμπισμένο στον αριστερό (δυτικό) εξωτερικό τοίχο
  const bedZ = bedroomLayout.bedZ
  const door = rebuiltWalls[0].openings[0] // η πόρτα είναι μπροστά από το κρεβάτι
  const wardrobeW = 2.4
  const wardrobeX = r.x2 - wardrobeW / 2 - 0.02
  const wardrobeZ = r.z1 + 0.32
  return (
    <group>
      <Box size={[2.4, 0.02, 2.0]} position={[bedX + 0.6, 0.03, bedZ]} color={C.rug} shadow={false} />
      <Bed x={bedX} z={bedZ} rotationY={Math.PI / 2} />
      {[-1.1, 1.1].map((dz) => (
        <group key={dz}>
          <Box size={[0.4, 0.5, 0.45]} position={[r.x1 + 0.25, 0.25, bedZ + dz]} color={C.woodDark} />
          <Cylinder radius={0.1} radiusBottom={0.14} height={0.22} position={[r.x1 + 0.25, 0.61, bedZ + dz]} color={C.white} />
        </group>
      ))}

      {/* πάνω (βόρειος) τοίχος: μεγάλη ντουλάπα δεξιά */}
      <Box size={[wardrobeW, 2.3, 0.62]} position={[wardrobeX, 1.15, wardrobeZ]} color={C.wood} />
      {[-0.15, 0.15].map((dx) => (
        <Box key={dx} size={[0.03, 0.4, 0.03]} position={[wardrobeX + dx, 1.1, wardrobeZ + 0.33]} color={C.metal} />
      ))}
      {/* δίπλα στην ντουλάπα: έπιπλο (σταντ) για βαλίτσες, με βαλίτσα */}
      <group position={[wardrobeX - wardrobeW / 2 - 0.65, 0, r.z1 + 0.32]}>
        <Box size={[1.0, 0.05, 0.5]} position={[0, 0.45, 0]} color={C.wood} />
        {[-0.45, 0.45].map((lx) => (
          <Box key={lx} size={[0.05, 0.43, 0.46]} position={[lx, 0.215, 0]} color={C.woodDark} />
        ))}
        <Box size={[0.72, 0.24, 0.44]} position={[0, 0.59, 0]} color={C.suitcase} />
      </group>

      {/* δεξιός εσωτερικός τοίχος: συρταριέρα με καθρέφτη, δίπλα στην πόρτα, στην αντίθετη πλευρά από την ντουλάπα */}
      <group position={[r.x2, 0, door.a2 + 0.25 + 0.55]}>
        <Box size={[0.45, 0.85, 1.1]} position={[-0.225, 0.425, 0]} color={C.wood} />
        {[0.2, 0.45, 0.7].map((y) => (
          <Box key={y} size={[0.02, 0.2, 1.0]} position={[-0.46, y, 0]} color={C.woodLight} shadow={false} />
        ))}
        <Box size={[0.04, 1.15, 0.95]} position={[-0.03, 1.55, 0]} color={C.woodDark} />
        <Box size={[0.02, 1.0, 0.82]} position={[-0.06, 1.55, 0]} color={C.mirror} roughness={0.05} shadow={false} />
      </group>

      <Plant x={r.x1 + 0.45} z={r.z2 - 0.5} />
    </group>
  )
}

/**
 * Τοίχος που ξαναχτίζεται με κώδικα, με πόρτες/παράθυρα στις θέσεις του πραγματικού
 * σπιτιού (βλ. `rebuiltWalls` στο src/content/tour.ts). Αντικαθιστά τις αντίστοιχες
 * ομάδες του OBJ, που κρύβονται στο PlanModel.
 */
function OpenWall({ wall }: { wall: RebuiltWall }) {
  const { axis, across, along, height, openings } = wall
  const t = across[1] - across[0]
  const ac = (across[0] + across[1]) / 2
  const TRIM = 0.05

  /** Κομμάτι τοίχου [a1,a2] × [y1,y2] με πάχος `thick`, σε συντεταγμένες κάτοψης */
  const piece = (a1: number, a2: number, y1: number, y2: number, thick = t) => {
    const len = a2 - a1
    const mid = (a1 + a2) / 2
    const ym = (y1 + y2) / 2
    const h = y2 - y1
    return axis === "z"
      ? { size: [thick, h, len] as Vec3, position: [ac, ym, mid] as Vec3 }
      : { size: [len, h, thick] as Vec3, position: [mid, ym, ac] as Vec3 }
  }

  // Συμπαγή κομμάτια: ανάμεσα στα ανοίγματα + κάτω/πάνω από κάθε άνοιγμα
  const solid: { a1: number; a2: number; y1: number; y2: number }[] = []
  let cursor = along[0]
  for (const o of [...openings].sort((a, b) => a.a1 - b.a1)) {
    if (o.a1 > cursor) solid.push({ a1: cursor, a2: o.a1, y1: 0, y2: height })
    if (o.y1 > 0) solid.push({ a1: o.a1, a2: o.a2, y1: 0, y2: o.y1 })
    if (o.y2 < height) solid.push({ a1: o.a1, a2: o.a2, y1: o.y2, y2: height })
    cursor = o.a2
  }
  if (cursor < along[1]) solid.push({ a1: cursor, a2: along[1], y1: 0, y2: height })

  return (
    <group>
      {solid.map((p, i) => (
        <Box key={i} {...piece(p.a1, p.a2, p.y1, p.y2)} color={C.wall} roughness={0.95} />
      ))}
      {openings.map((o, i) => (
        <OpeningTrim key={i} o={o} piece={piece} trim={TRIM} />
      ))}
    </group>
  )
}

/** Κάσα πόρτας ή κούφωμα με τζάμι για ένα άνοιγμα */
function OpeningTrim({
  o,
  piece,
  trim,
}: {
  o: Opening
  piece: (
    a1: number,
    a2: number,
    y1: number,
    y2: number,
    thick?: number,
  ) => { size: Vec3; position: Vec3 }
  trim: number
}) {
  const frame = (a1: number, a2: number, y1: number, y2: number) => (
    <Box {...piece(a1, a2, y1, y2, 0.1)} color={C.white} />
  )
  return (
    <group>
      {frame(o.a1, o.a1 + trim, o.y1, o.y2)}
      {frame(o.a2 - trim, o.a2, o.y1, o.y2)}
      {frame(o.a1, o.a2, o.y2 - trim, o.y2)}
      {o.kind === "window" && (
        <>
          {frame(o.a1, o.a2, o.y1, o.y1 + trim)}
          <Glass {...piece(o.a1 + trim, o.a2 - trim, o.y1 + trim, o.y2 - trim, 0.02)} />
        </>
      )}
    </group>
  )
}

/* ── Σαλόνι ───────────────────────────────────────────────────────────── */

function LivingRoom() {
  const r = roomRects.living
  const sx = 9.26 // απέναντι από την εξώπορτα (x ≈ 9.26 στον νότιο τοίχο)
  const sofaZ = r.z1 + 0.5
  return (
    <group>
      <Box size={[3.4, 0.02, 2.4]} position={[sx, 0.03, sofaZ + 1.1]} color={C.rug} shadow={false} />
      {/* καναπές ακουμπισμένος στον πάνω (βόρειο) τοίχο, με την πλάτη προς βορρά */}
      <Box size={[2.3, 0.42, 0.9]} position={[sx, 0.21, sofaZ]} color={C.sofa} />
      <Box size={[2.3, 0.5, 0.24]} position={[sx, 0.64, sofaZ - 0.35]} color={C.sofa} />
      {[-1.1, 1.1].map((dx) => (
        <Box key={dx} size={[0.2, 0.58, 0.9]} position={[sx + dx, 0.29, sofaZ]} color={C.sofa} />
      ))}
      <Box size={[1.9, 0.1, 0.6]} position={[sx, 0.47, sofaZ + 0.08]} color={C.cream} />
      {/* τραπεζάκι σαλονιού μπροστά από τον καναπέ */}
      <Box size={[1.1, 0.05, 0.6]} position={[sx, 0.42, sofaZ + 1.5]} color={C.wood} />
      <Box size={[1.0, 0.4, 0.5]} position={[sx, 0.2, sofaZ + 1.5]} color={C.woodDark} />
      {/* βοηθητικό τραπεζάκι & φωτιστικό δαπέδου δίπλα στον καναπέ */}
      <Box size={[0.45, 0.5, 0.45]} position={[sx + 1.55, 0.25, sofaZ - 0.1]} color={C.wood} />
      <Cylinder radius={0.02} height={1.5} position={[sx - 1.55, 0.75, sofaZ - 0.1]} color={C.metal} />
      <Cylinder radius={0.14} radiusBottom={0.24} height={0.3} position={[sx - 1.55, 1.55, sofaZ - 0.1]} color={C.white} />
      <Plant x={r.x2 - 0.45} z={r.z1 + 0.5} />
    </group>
  )
}

/* ── Τραπεζαρία ───────────────────────────────────────────────────────── */

function DiningArea() {
  const r = roomRects.dining
  // κάτω-αριστερά, κοντά στον τοίχο του υπνοδωματίου και αριστερά από την εξώπορτα
  const x = r.x1 + 1.95
  const z = 3.2
  return (
    <group>
      <Cylinder radius={0.58} height={0.05} position={[x, 0.75, z]} color={C.wood} />
      <Cylinder radius={0.06} height={0.73} position={[x, 0.37, z]} color={C.woodDark} />
      <Chair x={x} z={z - 0.78} />
      <Chair x={x} z={z + 0.78} rotationY={Math.PI} />
      <Chair x={x + 0.78} z={z} rotationY={-Math.PI / 2} />
      <Chair x={x - 0.78} z={z} rotationY={Math.PI / 2} />
      {/* ραφιέρα στον τοίχο του υπνοδωματίου & φυτό δίπλα στο παράθυρο */}
      <Box size={[0.4, 0.8, 1.4]} position={[r.x1 + 0.22, 0.4, z]} color={C.wood} />
      <Plant x={r.x2 - 0.45} z={r.z2 - 0.5} scale={0.8} />
    </group>
  )
}

/* ── Κουζίνα ──────────────────────────────────────────────────────────── */

function Kitchen() {
  const r = roomRects.kitchen
  // πάγκοι κολλητά στον δεξί (ανατολικό) τοίχο, κάτω από το μπάνιο
  const fridgeZ = r.z1 + 0.42
  const z0 = r.z1 + 0.82
  const z1 = r.z2 - 0.05
  const len = z1 - z0
  const cz = (z0 + z1) / 2
  const baseX = r.x2 - 0.31
  const wallX = r.x2 - 0.2
  return (
    <group>
      <Box size={[0.62, 0.88, len]} position={[baseX, 0.44, cz]} color={C.white} />
      <Box size={[0.66, 0.04, len + 0.04]} position={[baseX - 0.01, 0.9, cz]} color={C.wood} />
      {/* νεροχύτης & μία φορητή επαγωγική εστία (όχι εστίες κουζίνας) */}
      <Box size={[0.4, 0.02, 0.55]} position={[baseX, 0.93, z0 + 0.7]} color="#9aa3a8" roughness={0.2} />
      <Box size={[0.36, 0.03, 0.32]} position={[baseX, 0.945, z0 + 1.9]} color={C.screen} roughness={0.3} />
      <Box size={[0.36, 0.7, len]} position={[wallX, 1.85, cz]} color={C.white} />
      {/* ψυγείο στην άκρη, κάτω από το μπάνιο */}
      <Box size={[0.65, 1.9, 0.65]} position={[r.x2 - 0.36, 0.95, fridgeZ]} color={C.fridge} roughness={0.4} />
    </group>
  )
}

/* ── Μπάνιο ───────────────────────────────────────────────────────────── */

function Bathroom() {
  const r = roomRects.bathroom
  const sx = r.x2 - 0.5 // ντουζιέρα στη βορειοανατολική γωνία
  const sz = r.z1 + 0.5
  return (
    <group>
      <Box size={[0.95, 0.06, 0.95]} position={[sx, 0.05, sz]} color={C.white} />
      <Glass size={[0.02, 1.9, 0.95]} position={[sx - 0.475, 0.95, sz]} />
      <Glass size={[0.95, 1.9, 0.02]} position={[sx, 0.95, sz + 0.475]} />
      <Cylinder radius={0.01} height={0.5} position={[sx + 0.4, 1.7, sz - 0.2]} color={C.metal} />
      {/* λεκάνη */}
      <Box size={[0.38, 0.4, 0.55]} position={[r.x1 + 0.95, 0.2, r.z1 + 0.35]} color={C.white} />
      <Box size={[0.38, 0.4, 0.2]} position={[r.x1 + 0.95, 0.6, r.z1 + 0.15]} color={C.white} />
      {/* νιπτήρας με έπιπλο & καθρέφτης */}
      <Box size={[0.6, 0.8, 0.45]} position={[r.x1 + 2.0, 0.4, r.z1 + 0.25]} color={C.wood} />
      <Box size={[0.45, 0.1, 0.35]} position={[r.x1 + 2.0, 0.85, r.z1 + 0.28]} color={C.white} />
      <Box size={[0.5, 0.7, 0.02]} position={[r.x1 + 2.0, 1.5, r.z1 + 0.02]} color="#c9d6dc" roughness={0.1} />
      {/* χαλάκι & καλάθι */}
      <Box size={[0.9, 0.02, 0.55]} position={[r.x1 + 2.0, 0.03, r.z1 + 1.0]} color={C.cream} shadow={false} />
      <Cylinder radius={0.2} height={0.55} position={[r.x1 + 0.35, 0.3, r.z2 - 0.4]} color={C.headboard} />
    </group>
  )
}

/** Δάπεδα + έπιπλα, σε συντεταγμένες κάτοψης */
export function PlanInterior() {
  const { x1, x2, z1, z2 } = { x1: -1.0, x2: 16.0, z1: -3.05, z2: 5.1 }
  return (
    <group>
      {/* «πλάκα» κάτω από το κτίριο, για εμφάνιση κουκλόσπιτου */}
      <Box
        size={[x2 - x1 + 0.3, 0.24, z2 - z1 + 0.3]}
        position={[(x1 + x2) / 2, -0.13, (z1 + z2) / 2]} /* κορυφή στο y=-0.01, ώστε να μην τρεμοπαίζει με το έδαφος του OBJ */
        color={C.slab}
        roughness={0.95}
      />
      <Floor rect={roomRects.bedroom} color={C.wood} />
      <Floor rect={roomRects.living} color={C.wood} />
      <Floor rect={roomRects.dining} color={C.wood} />
      <Floor rect={entranceRect} color={C.wood} />
      <Floor rect={roomRects.kitchen} color={C.tile} />
      <Floor rect={roomRects.bathroom} color={C.tileDark} />
      {rebuiltWalls.map((w) => (
        <OpenWall key={w.objPrefixes.join()} wall={w} />
      ))}
      <Bedroom />
      <LivingRoom />
      <DiningArea />
      <Kitchen />
      <Bathroom />
    </group>
  )
}
