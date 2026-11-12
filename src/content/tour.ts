/**
 * Ρυθμίσεις της 3D Κάτοψης στο Hero.
 *
 * ── Πώς αλλάζετε / ενημερώνετε την κάτοψη ───────────────────────────────────
 * 1. Στο Sweet Home 3D: Αρχείο → Εξαγωγή σε μορφή OBJ (το .mtl δημιουργείται μαζί).
 * 2. Αντιγράψτε τα αρχεία πάνω στα  public/models/miranda.obj  και  miranda.mtl
 *    (ονόματα χωρίς ελληνικούς χαρακτήρες/κενά).
 * 3. Αν άλλαξαν οι τοίχοι, ενημερώστε παρακάτω τα `plan` και `roomRects`.
 *
 * Το αρχείο OBJ του Sweet Home 3D είναι σε ΕΚΑΤΟΣΤΑ (scale 0.01 → μέτρα) και περιέχει
 * μόνο τοίχους, παράθυρα, πόρτα και το έδαφος. Τα δάπεδα και τα έπιπλα προστίθενται
 * με κώδικα στο src/components/tour/plan-interior.tsx (ενδεικτικά).
 *
 * Συντεταγμένες κάτοψης (`plan`/`roomRects`): μέτρα, όπως στο Sweet Home 3D
 * (x → ανατολή, z → νότος· η εξώπορτα είναι στον νότιο τοίχο). Διαβάζονται από το
 * αρχείο OBJ ως εκατοστά / 100.
 */
import type { Localized } from "./property"

export type Vec3 = [number, number, number]

export type CameraView = {
  /** Πού βρίσκεται η κάμερα */
  position: Vec3
  /** Πού κοιτάζει η κάμερα */
  target: Vec3
}

/** Ορθογώνιο στην κάτοψη, σε μέτρα */
export type Rect = { x1: number; x2: number; z1: number; z2: number }

/** Εξωτερικά όρια της κάτοψης (από το miranda.obj) */
const plan: Rect = { x1: -1.01, x2: 16.02, z1: -3.06, z2: 5.11 }

/** Το κέντρο της κάτοψης: το μοντέλο μετακινείται ώστε να είναι στο (0, 0, 0) */
const center = { x: (plan.x1 + plan.x2) / 2, z: (plan.z1 + plan.z2) / 2 }

/**
 * Τα δωμάτια ως ορθογώνια (εσωτερικές όψεις τοίχων), όπως τα βλέπετε στην κάτοψη
 * με τον βορρά πάνω. Το αρχείο OBJ δεν περιέχει ονόματα δωματίων, οπότε η
 * αντιστοίχιση γίνεται εδώ — αλλάξτε τα όρια αν χρειάζεται:
 *  - bedroom:  αριστερός χώρος (παράθυρα δυτικά και νότια)
 *  - living:   κεντρικός χώρος, πάνω πλευρά — απέναντι από την εξώπορτα
 *  - dining:   κάτω-αριστερά στον κεντρικό χώρο, αριστερά από την εξώπορτα
 *  - kitchen:  κάτω-δεξιά, κάτω από το μπάνιο (μικρή κουζίνα — kitchenette, χωρίς εστίες κουζίνας)
 *  - bathroom: κλειστός χώρος στην πάνω-δεξιά γωνία
 */
export const roomRects = {
  bedroom: { x1: -0.94, x2: 3.93, z1: -2.99, z2: 5.04 },
  living: { x1: 4.0, x2: 11.95, z1: -2.99, z2: 1.06 },
  dining: { x1: 4.0, x2: 8.0, z1: 1.06, z2: 5.04 },
  kitchen: { x1: 12.02, x2: 15.95, z1: 1.06, z2: 5.04 },
  bathroom: { x1: 12.02, x2: 15.95, z1: -2.99, z2: 0.98 },
} satisfies Record<string, Rect>

/** Χώρος εισόδου (μόνο δάπεδο, χωρίς pin): ανάμεσα στην τραπεζαρία και την κουζίνα */
export const entranceRect: Rect = { x1: 8.0, x2: 12.02, z1: 1.06, z2: 5.04 }

/** Το κρεβάτι είναι κεντραρισμένο σε αυτό το z· η πόρτα και το παράθυρο ευθυγραμμίζονται μαζί του */
export const bedroomLayout = { bedZ: 1.6 }

/** Άνοιγμα (πόρτα ή παράθυρο) σε τοίχο. `a1`–`a2`: κατά μήκος του τοίχου, `y1`–`y2`: ύψος (μέτρα) */
export type Opening = {
  a1: number
  a2: number
  y1: number
  y2: number
  kind: "door" | "window"
}

/**
 * Τοίχος του OBJ που ξαναχτίζεται με κώδικα, ώστε να έχει τα ανοίγματα του πραγματικού
 * σπιτιού. Το αρχείο OBJ έχει συμπαγείς τοίχους (και παράθυρα ενδεικτικών διαστάσεων)·
 * οι ομάδες του που ξεκινούν με `objPrefixes` κρύβονται και ο τοίχος σχεδιάζεται ξανά.
 * Συντεταγμένες κάτοψης, μέτρα.
 */
export type RebuiltWall = {
  objPrefixes: string[]
  /** Κατεύθυνση που τρέχει ο τοίχος: "z" = βορρά–νότο, "x" = ανατολή–δύση */
  axis: "x" | "z"
  /** Πάχος: [από, έως] στον κάθετο άξονα */
  across: [number, number]
  /** Μήκος: [από, έως] κατά μήκος του τοίχου */
  along: [number, number]
  height: number
  openings: Opening[]
}

export const rebuiltWalls: RebuiltWall[] = [
  // Διαχωριστική υπνοδωματίου–σαλονιού (στο OBJ: wall_8) — πόρτα ΜΠΡΟΣΤΑ από το κρεβάτι
  {
    objPrefixes: ["wall_8_"],
    axis: "z",
    across: [3.93, 4.0],
    along: [-3.02, 5.08],
    height: 2.5,
    openings: [
      {
        a1: bedroomLayout.bedZ - 0.45,
        a2: bedroomLayout.bedZ + 0.45,
        y1: 0,
        y2: 2.05,
        kind: "door",
      },
    ],
  },
  // Δυτικός εξωτερικός τοίχος (wall_4) — μικρό οριζόντιο παράθυρο ΠΑΝΩ από το κρεβάτι
  {
    objPrefixes: ["wall_4_"],
    axis: "z",
    across: [-1.01, -0.94],
    along: [-3.06, 5.11],
    height: 2.5,
    openings: [
      {
        a1: bedroomLayout.bedZ - 0.5,
        a2: bedroomLayout.bedZ + 0.5,
        y1: 1.4,
        y2: 1.95,
        kind: "window",
      },
    ],
  },
  // Νότιος τοίχος μπάνιου (wall_6/wall_7) — πόρτα του μπάνιου προς την κουζίνα
  {
    objPrefixes: ["wall_6_", "wall_7_"],
    axis: "x",
    across: [0.98, 1.06],
    along: [11.95, 15.98],
    height: 2.5,
    openings: [{ a1: 12.7, a2: 13.5, y1: 0, y2: 2.05, kind: "door" }],
  },
]

/**
 * Περιοχές του OBJ (κάτοψη, μέτρα) όπου κρύβονται όλα τα αντικείμενα που βρίσκονται μέσα:
 * το αρχικό, κατακόρυφο παράθυρο του υπνοδωματίου, που αντικαταστάθηκε από το νέο.
 */
export const removedObjRegions: Rect[] = [
  { x1: -1.2, x2: -0.8, z1: -0.8, z2: 0.5 },
]

export type RoomId = keyof typeof roomRects

/** Συντεταγμένες κάτοψης → συντεταγμένες σκηνής (κέντρο στο 0, 0, 0) */
const toScene = (x: number, y: number, z: number): Vec3 => [
  x - center.x,
  y,
  z - center.z,
]

export type TourRoom = {
  id: RoomId
  label: Localized
  description: Localized
  rect: Rect
  /** Πραγματικές φωτογραφίες του χώρου (διαδρομές στο public/, όπως στο gallery του property.ts) */
  photos: string[]
  /** Θέση του clickable σημείου ενδιαφέροντος (συντεταγμένες σκηνής) */
  hotspot: Vec3
}

/* ── Προσαρμογή κάμερας ─────────────────────────────────────────────────────
 * Η κάμερα υπολογίζεται από τις ΠΡΑΓΜΑΤΙΚΕΣ διαστάσεις του viewer (κινητό, desktop,
 * πλήρης οθόνη), ώστε ο χώρος και τα pins να χωράνε πάντα μέσα στην ελεύθερη ζώνη
 * ανάμεσα στο πάνω μενού και τα κουμπιά/την κάρτα στο κάτω μέρος. */

/** Κατακόρυφο πεδίο όρασης της κάμερας — ίδιο με το Canvas στο tour-scene.tsx */
export const CAMERA_FOV = 38

export type Viewport = { width: number; height: number }

/** Πάνω/κάτω περιοχές (px) που καλύπτονται από στοιχεία του viewer */
type Insets = { top: number; bottom: number }

const PIN_HALF_W = 52 // ≈ μισό πλάτος ετικέτας pin (px)
const PIN_HALF_H = 17
const SAFE = 6 // περιθώριο ασφαλείας (px)

const vAdd = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const vScale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k]
const vDot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const vCross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const vNorm = (a: Vec3): Vec3 => vScale(a, 1 / Math.hypot(a[0], a[1], a[2]))

/**
 * Βρίσκει τη μικρότερη απόσταση κάμερας ώστε όλα τα `points` (και τα `pins`, με το
 * μέγεθος της ετικέτας τους) να χωράνε στην ελεύθερη ζώνη του viewer, και μετακινεί τον
 * στόχο ώστε το περιεχόμενο να κεντράρεται σε αυτήν.
 *  - dir: κατεύθυνση από τον στόχο προς την κάμερα
 */
function fitCamera(opts: {
  points: Vec3[]
  pins: Vec3[]
  dir: Vec3
  target: Vec3
  viewport: Viewport
  insets: Insets
}): CameraView {
  const { points, pins, target, viewport } = opts
  const { width, height } = viewport
  const aspect = width / height
  const tan = Math.tan((CAMERA_FOV * Math.PI) / 360)
  const top = Math.min(opts.insets.top, height * 0.3) + SAFE
  const bottom = Math.min(opts.insets.bottom, height * 0.45) + SAFE

  const d = vNorm(opts.dir)
  const f = vScale(d, -1) // προς τα εμπρός
  const r = vNorm(vCross(f, [0, 1, 0])) // δεξιά
  const u = vCross(r, f) // πάνω

  const padX = PIN_HALF_W / (width / 2)
  const padY = PIN_HALF_H / (height / 2)
  const bandW = 2 * (1 - 0.04)
  const bandH = 2 * (height - top - bottom) / height

  const extent = (dist: number) => {
    const cam = vAdd(target, vScale(d, dist))
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity
    const add = (p: Vec3, px: number, py: number) => {
      const rel: Vec3 = [p[0] - cam[0], p[1] - cam[1], p[2] - cam[2]]
      const z = vDot(rel, f)
      const x = vDot(rel, r) / (z * tan * aspect)
      const y = vDot(rel, u) / (z * tan)
      minX = Math.min(minX, x - px)
      maxX = Math.max(maxX, x + px)
      minY = Math.min(minY, y - py)
      maxY = Math.max(maxY, y + py)
    }
    points.forEach((p) => add(p, 0, 0))
    pins.forEach((p) => add(p, padX, padY))
    return { minX, maxX, minY, maxY }
  }

  let lo = 2
  let hi = 200
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    const e = extent(mid)
    if (e.maxX - e.minX <= bandW && e.maxY - e.minY <= bandH) hi = mid
    else lo = mid
  }
  const dist = hi

  // Κεντράρισμα του περιεχομένου στην ελεύθερη ζώνη (μετακίνηση στόχου + κάμερας)
  const e = extent(dist)
  const bandCenterY = (1 - (2 * top) / height + (-1 + (2 * bottom) / height)) / 2
  const shiftX = -((e.minX + e.maxX) / 2)
  const shiftY = bandCenterY - (e.minY + e.maxY) / 2
  const move = vAdd(
    vScale(r, -shiftX * tan * aspect * dist),
    vScale(u, -shiftY * tan * dist),
  )
  const t2 = vAdd(target, move)
  return { target: t2, position: vAdd(t2, vScale(d, dist)) }
}

/** Γωνίες του ορθογωνίου σε συντεταγμένες σκηνής, στα ύψη `ys` */
function cornersOf(rect: Rect, ys: number[]): Vec3[] {
  return [
    [rect.x1, rect.z1],
    [rect.x2, rect.z1],
    [rect.x2, rect.z2],
    [rect.x1, rect.z2],
  ].flatMap(([x, z]) => ys.map((y) => toScene(x, y, z)))
}

function room(
  id: RoomId,
  label: Localized,
  description: Localized,
  photos: string[],
): TourRoom {
  const rect = roomRects[id]
  return {
    id,
    label,
    description,
    rect,
    photos,
    hotspot: toScene((rect.x1 + rect.x2) / 2, 1.5, (rect.z1 + rect.z2) / 2),
  }
}

export const tour = {
  /** Το μοντέλο από το Sweet Home 3D (σε εκατοστά) */
  objUrl: "/models/miranda.obj",
  mtlUrl: "/models/miranda.mtl",
  /** Εκατοστά → μέτρα */
  scale: 0.01,

  plan,
  /** Μετακίνηση του μοντέλου ώστε το κέντρο του να πέσει στο (0, 0, 0) */
  center,
  toScene,

  /** Αρχική (πανοραμική) κάμερα — για οριζόντιες οθόνες, από νότια */
  defaultView: {
    position: [4, 15.5, 14.5],
    target: [0, 0, 0.3],
  } satisfies CameraView,

  /**
   * Πανοραμική κάμερα για τον viewer. Η κάτοψη είναι μακρόστενη (17 × 8 μ.): σε όρθιες
   * οθόνες (κινητά) κοιτάμε από ανατολικά, ώστε ο μεγάλος άξονας να πέφτει στο ύψος της
   * οθόνης. Χωράνε πάντα όλη η κάτοψη και όλα τα pins.
   */
  overviewView(viewport: Viewport): CameraView {
    const portrait = viewport.width / viewport.height < 0.85
    return fitCamera({
      points: cornersOf(plan, [0, 2.5]),
      pins: this.rooms.map((r) => r.hotspot),
      dir: portrait ? [15, 17, 2.5] : [4, 15.5, 14.2],
      target: portrait ? [0, 0, 0] : [0, 0, 0.3],
      viewport,
      insets: { top: 116, bottom: 16 },
    })
  },

  /** Κάμερα από νότια, ψηλά, που «βλέπει» το δωμάτιο ολόκληρο πάνω από την κάρτα πληροφοριών */
  roomView(room: TourRoom, viewport: Viewport): CameraView {
    const rect = room.rect
    const w = rect.x2 - rect.x1
    const d = rect.z2 - rect.z1
    const s = Math.max(d, w * 0.85)
    const [cx, , cz] = toScene((rect.x1 + rect.x2) / 2, 0, (rect.z1 + rect.z2) / 2)
    return fitCamera({
      points: cornersOf(rect, [0, 1.0]),
      pins: [room.hotspot],
      dir: [0, 0.95 * s + 3.2, 0.45 * s + 1.4],
      target: [cx, 0.3, cz],
      viewport,
      insets: { top: 116, bottom: 188 },
    })
  },

  rooms: [
    room(
      "bedroom",
      { el: "Υπνοδωμάτιο", en: "Bedroom" },
      {
        el: "Ήσυχο υπνοδωμάτιο με διπλό κρεβάτι για ξεκούραστο ύπνο, μέρα ή νύχτα.",
        en: "A quiet bedroom with a double bed for restful sleep, day or night.",
      },
      ["/photo12.jpg", "/photo1.jpg", "/photo7.jpg", "/photo2.jpg"],
    ),
    room(
      "living",
      { el: "Σαλόνι", en: "Living room" },
      {
        el: "Άνετο σαλόνι με καναπέ για χαλάρωση.",
        en: "A comfortable living room with a sofa to unwind.",
      },
      ["/photo14.jpg", "/photo5.jpg"],
    ),
    room(
      "dining",
      { el: "Τραπεζαρία", en: "Dining area" },
      {
        el: "Τραπεζαρία για να απολαμβάνετε το φαγητό σας.",
        en: "A dining area to enjoy your meals.",
      },
      ["/photo11.jpg", "/photo5.jpg"],
    ),
    room(
      "kitchen",
      { el: "Μικρή κουζίνα", en: "Kitchenette" },
      {
        el: "Μικρή κουζίνα (kitchenette) με ψυγείο, επαγωγική εστία και καφετιέρα espresso.",
        en: "A kitchenette with a fridge, an induction hob and an espresso machine.",
      },
      ["/photo4.jpg", "/photo8.jpg"],
    ),
    room(
      "bathroom",
      { el: "Μπάνιο", en: "Bathroom" },
      {
        el: "Μπάνιο με ντουζιέρα.",
        en: "A bathroom with a shower.",
      },
      ["/photo3.jpg"],
    ),
  ] satisfies TourRoom[],
}
