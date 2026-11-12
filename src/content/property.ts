/**
 * Όλα τα στοιχεία του καταλύματος σε ένα σημείο.
 * Αλλάξτε εδώ κείμενα, τιμές και κανόνες — η σελίδα ενημερώνεται αυτόματα.
 *
 * Τιμές `null` / κενές λίστες = δεν είναι ακόμη γνωστά και ΔΕΝ εμφανίζονται στη σελίδα.
 * Τα σημεία με «TODO» θέλουν συμπλήρωση με τα πραγματικά στοιχεία.
 */
import type { Locale } from "@/i18n/routing"

export type Localized = Record<Locale, string>

export const tr = (value: Localized, locale: Locale) => value[locale]

export const property = {
  name: "Miranda's House Ioannina",
  shortName: "Miranda's House",
  slogan: {
    el: "Κομψή, ζεστή και άνετη φιλοξενία",
    en: "Elegant, warm and comfortable hospitality",
  } satisfies Localized,
  city: { el: "Ιωάννινα", en: "Ioannina" } satisfies Localized,
  tagline: {
    el: "Κομψή, ζεστή και άνετη φιλοξενία στα Ιωάννινα",
    en: "Elegant, warm and comfortable stays in Ioannina",
  } satisfies Localized,
  summary: {
    el: "Ήσυχο διαμέρισμα με κοινόχρηστη αυλή στη Λεωφ. Μακρυγιάννη, λίγα λεπτά από το Γενικό Νοσοκομείο Ιωαννίνων «Γ. Χατζηκώστα», με πάρκινγκ στο κατάλυμα. Ιδανικό για ταξιδιώτες αναψυχής, συνοδούς ασθενών και ιατρικό προσωπικό.",
    en: "A quiet apartment with a shared courtyard on Makrygianni Avenue, just minutes from the G. Hatzikosta General Hospital of Ioannina, with parking at the property. Ideal for leisure travellers, patients' companions and medical staff.",
  } satisfies Localized,

  address: {
    street: {
      el: "Λεωφ. Στρ. Μακρυγιάννη 23Α",
      en: "23A Strat. Makrygianni Ave.",
    } satisfies Localized,
    postalCode: "454 45",
    city: { el: "Ιωάννινα", en: "Ioannina" } satisfies Localized,
    countryCode: "GR",
  },

  /** TODO: συμπληρώστε από το Booking.com (null = δεν εμφανίζεται) */
  capacity: {
    guests: null as number | null,
    bedrooms: null as number | null,
    beds: null as number | null,
    baths: null as number | null,
  },

  /** Από το Booking.com: check-in από 15:00, check-out έως 12:00 */
  checkIn: "15:00",
  checkOut: "12:00",

  /**
   * TODO (νομικά στοιχεία για την Πολιτική απορρήτου): το ονοματεπώνυμο ή η επωνυμία του
   * φορέα εκμετάλλευσης (π.χ. "Μιράντα Χ.") και ένα email επικοινωνίας. Όσο είναι null
   * δεν εμφανίζονται και η επικοινωνία γίνεται μόνο με τηλέφωνο/Viber και διεύθυνση.
   */
  operatorName: null as string | null,

  contact: {
    email: null as string | null,
    phoneDisplay: "694 287 8689",
    /** Διεθνής μορφή χωρίς κενά — για tel:, Viber */
    phoneE164: "+306942878689",
  },

  bookingUrl:
    "https://www.booking.com/hotel/gr/mirandas-house-kompse-zeste-kai-anete-philoxenia.el.html",
  airbnbUrl: "https://www.airbnb.com/rooms/1602783469377968801",

  /** Αριθμός αδείας / μητρώου ακινήτου βραχυχρόνιας διαμονής (από το Booking.com) */
  amaNumber: "00003625742",

  /** Κύρια φωτογραφία (εμφανίζεται κατά τη φόρτωση του 3D, σε OG/SEO και ως εναλλακτική του 3D) */
  heroImage: {
    src: "/photo5.jpg",
    width: 1024,
    height: 721,
    alt: {
      el: "Σαλόνι με τραπεζαρία και καναπέ",
      en: "Living area with dining table and sofa",
    } satisfies Localized,
  },
} as const

/** Δημιουργός της ιστοσελίδας (εμφανίζεται στο footer και στα metadata) */
export const siteCredit = {
  name: { el: "Ναταλία Μπάρκα", en: "Natalia Barka" } satisfies Localized,
}

export const fullAddress = (locale: Locale) =>
  `${tr(property.address.street, locale)}, ${tr(property.address.city, locale)} ${property.address.postalCode}`

/* ── Χρόνοι απόστασης ───────────────────────────────────────────────────── */

/**
 * Χρόνοι από το Google Maps (λεπτά) — ΥΠΕΡΙΣΧΥΟΥΝ των αυτόματων υπολογισμών
 * του `npm run distances`. Τα κλειδιά είναι τα id του src/content/location.json.
 * Ισχύουν για Ελληνικά και Αγγλικά (τα κείμενα μεταφράζονται αυτόματα).
 * Όσα σημεία δεν υπάρχουν εδώ (σούπερ μάρκετ, φαρμακείο, στάση) υπολογίζονται αυτόματα.
 */
export const travelTimes: Record<
  string,
  { walkMin: number; driveMin: number }
> = {
  hospital: { walkMin: 3, driveMin: 1 },
  center: { walkMin: 15, driveMin: 4 },
  lake: { walkMin: 20, driveMin: 5 },
  castle: { walkMin: 22, driveMin: 6 },
  // Δίπλα στο κατάλυμα (δήλωση ιδιοκτήτη)
  pharmacy: { walkMin: 1, driveMin: 1 },
  bus: { walkMin: 1, driveMin: 1 },
}

/* ── Τιμές ──────────────────────────────────────────────────────────────── */

export type Season = {
  /** "MM-DD" — συμπεριλαμβάνεται */
  from: string
  /** "MM-DD" — συμπεριλαμβάνεται (μπορεί να «τυλίγει» το νέο έτος, π.χ. 12-20 → 01-06) */
  to: string
  perNight: number
  label: Localized
}

export const pricing = {
  /**
   * TODO: ΕΝΔΕΙΚΤΙΚΕΣ τιμές — αντικαταστήστε με τις πραγματικές και βάλτε
   * `isPlaceholder: false` (μέχρι τότε εμφανίζεται σημείωση στον υπολογιστή).
   */
  isPlaceholder: true,
  currency: "EUR",
  basePerNight: 60,
  /** Εποχικές τιμές (υπερισχύουν της βασικής). Η πρώτη που ταιριάζει κερδίζει. */
  seasons: [
    {
      from: "12-20",
      to: "01-06",
      perNight: 70,
      label: { el: "Γιορτές", en: "Holidays" },
    },
  ] as Season[],
  cleaningFee: 0,
  minNights: 1,
  /** Έκπτωση % για διαμονές ≥ 7 νυχτών (0 = καμία) */
  weeklyDiscountPct: 10,
  /** Μέγιστοι επισκέπτες στη φόρμα — TODO: ίδιο με τη χωρητικότητα */
  maxGuests: 4,
  /**
   * Τέλος ανθεκτικότητας στην κλιματική κρίση (ανά διανυκτέρευση, ακίνητα
   * βραχυχρόνιας μίσθωσης). Επιβεβαιώστε τα ισχύοντα ποσά με τον λογιστή σας.
   */
  climateFee: { aprToOct: 8, novToMar: 2 },
}

/* ── Περιεχόμενο ενοτήτων ──────────────────────────────────────────────── */

/**
 * Φωτογραφίες από τον φάκελο public/ (π.χ. "/photo5.jpg"). Η σειρά εδώ είναι η σειρά
 * στη γκαλερί. Για νέα φωτογραφία βάλτε το αρχείο στο public/ και προσθέστε γραμμή
 * με src, width, height (σε pixel) και περιγραφή.
 */
export type Photo = {
  src: string
  width: number
  height: number
  alt: Localized
}

export const gallery: Photo[] = [
  {
    src: "/photo5.jpg",
    width: 1024,
    height: 721,
    alt: {
      el: "Σαλόνι με τραπεζαρία και καναπέ",
      en: "Living area with dining table and sofa",
    },
  },
  {
    src: "/photo12.jpg",
    width: 576,
    height: 768,
    alt: {
      el: "Υπνοδωμάτιο με διπλό κρεβάτι",
      en: "Bedroom with a double bed",
    },
  },
  {
    src: "/photo4.jpg",
    width: 576,
    height: 768,
    alt: {
      el: "Μικρή κουζίνα (kitchenette) με πλυντήριο",
      en: "Kitchenette with a washing machine",
    },
  },
  {
    src: "/photo3.jpg",
    width: 1017,
    height: 768,
    alt: { el: "Μπάνιο με ντουζιέρα", en: "Bathroom with a shower" },
  },
  {
    src: "/photo14.jpg",
    width: 430,
    height: 768,
    alt: { el: "Γωνιά καθιστικού με καναπέ", en: "Sofa corner in the living area" },
  },
  {
    src: "/photo7.jpg",
    width: 576,
    height: 768,
    alt: {
      el: "Υπνοδωμάτιο με ξύλινη οροφή και τηλεόραση",
      en: "Bedroom with a wooden ceiling and TV",
    },
  },
  {
    src: "/photo11.jpg",
    width: 576,
    height: 768,
    alt: { el: "Στρογγυλό τραπέζι φαγητού", en: "Round dining table" },
  },
  {
    src: "/photo1.jpg",
    width: 576,
    height: 768,
    alt: { el: "Υπνοδωμάτιο με διπλό κρεβάτι", en: "Bedroom with a double bed" },
  },
  {
    src: "/photo2.jpg",
    width: 576,
    height: 768,
    alt: {
      el: "Υπνοδωμάτιο με ντουλάπα και πόρτα προς το σαλόνι",
      en: "Bedroom with a wardrobe and a door to the living area",
    },
  },
  {
    src: "/photo8.jpg",
    width: 576,
    height: 768,
    alt: { el: "Ντουλάπια κουζίνας με σκεύη", en: "Kitchen cupboards with tableware" },
  },
  {
    src: "/photo6.jpg",
    width: 367,
    height: 768,
    alt: {
      el: "Είσοδος με τραπεζάκι και καρέκλες",
      en: "Entrance with a small table and chairs",
    },
  },
  {
    src: "/photo13.jpg",
    width: 943,
    height: 768,
    alt: {
      el: "Κοινόχρηστη αυλή με πέτρινο δάπεδο και ψησταριά",
      en: "Shared courtyard with a stone floor and barbecue",
    },
  },
]

/** Φωτογραφίες θέσης (χάρτης/δρόμος με ένδειξη απόστασης) — εμφανίζονται στην ενότητα του νοσοκομείου */
export const locationPhotos: Photo[] = [
  {
    src: "/photo9.jpg",
    width: 473,
    height: 768,
    alt: {
      el: "Δορυφορική εικόνα με το κατάλυμα και το Γενικό Νοσοκομείο Ιωαννίνων",
      en: "Satellite view showing the apartment and the General Hospital of Ioannina",
    },
  },
  {
    src: "/photo10.jpg",
    width: 429,
    height: 768,
    alt: {
      el: "Η Λεωφόρος Μακρυγιάννη μπροστά από το κατάλυμα",
      en: "Makrygianni Avenue in front of the apartment",
    },
  },
]

export type AmenityIcon =
  | "ac"
  | "bath"
  | "bbq"
  | "bedlinen"
  | "blinds"
  | "building"
  | "city"
  | "coffee"
  | "cooking"
  | "courtyard"
  | "crib"
  | "dining"
  | "dishes"
  | "dryer"
  | "entrance"
  | "extinguisher"
  | "firstaid"
  | "floor"
  | "fridge"
  | "garden"
  | "hairdryer"
  | "hangers"
  | "heating"
  | "host"
  | "hotwater"
  | "iron"
  | "kettle"
  | "kitchenette"
  | "languages"
  | "longstay"
  | "mountain"
  | "nosmoking"
  | "outdoordining"
  | "outdoorfurniture"
  | "parking"
  | "pillows"
  | "rack"
  | "shower"
  | "smoke"
  | "soap"
  | "socket"
  | "sofa"
  | "sofabed"
  | "soundproof"
  | "stove"
  | "terrace"
  | "tv"
  | "wardrobe"
  | "washer"
  | "wifi"
  | "wine"

export type Amenity = { icon: AmenityIcon; label: Localized }
export type AmenityGroup = { id: string; title: Localized; items: Amenity[] }

/**
 * Παροχές: συγχώνευση των λιστών του Airbnb και του Booking.com. Δεν περιλαμβάνονται όσες
 * το Airbnb σημειώνει ως μη διαθέσιμες (κάμερες ασφαλείας, πλήρης κουζίνα, είδη πρώτης
 * ανάγκης, ανιχνευτής μονοξειδίου του άνθρακα) ούτε οι πετσέτες/σεντόνια, που στο
 * Booking.com εμφανίζονται και ως υπηρεσία με επιπλέον χρέωση (ασαφές αν περιλαμβάνονται).
 */
export const amenityGroups: AmenityGroup[] = [
  {
    id: "views",
    title: { el: "Θέα", en: "Scenic views" },
    items: [
      { icon: "courtyard", label: { el: "Θέα στην αυλή", en: "Courtyard view" } },
      { icon: "garden", label: { el: "Θέα στον κήπο", en: "Garden view" } },
      { icon: "mountain", label: { el: "Θέα στο βουνό", en: "Mountain view" } },
      { icon: "city", label: { el: "Θέα στον ορίζοντα της πόλης", en: "City skyline view" } },
    ],
  },
  {
    id: "bathroom",
    title: { el: "Μπάνιο", en: "Bathroom" },
    items: [
      { icon: "bath", label: { el: "Ιδιωτικό μπάνιο", en: "Private bathroom" } },
      { icon: "shower", label: { el: "Ντους", en: "Shower" } },
      { icon: "hairdryer", label: { el: "Πιστολάκι μαλλιών", en: "Hair dryer" } },
      { icon: "soap", label: { el: "Σαμπουάν", en: "Shampoo" } },
      { icon: "soap", label: { el: "Σαπούνι σώματος", en: "Body soap" } },
      { icon: "shower", label: { el: "Αφρόλουτρο", en: "Shower gel" } },
      { icon: "hotwater", label: { el: "Ζεστό νερό", en: "Hot water" } },
    ],
  },
  {
    id: "bedroom",
    title: { el: "Υπνοδωμάτιο και πλυντήριο", en: "Bedroom and laundry" },
    items: [
      { icon: "washer", label: { el: "Πλυντήριο ρούχων δωρεάν – εντός του χώρου", en: "Free washing machine – in unit" } },
      { icon: "dryer", label: { el: "Στεγνωτήριο δωρεάν – εντός του χώρου", en: "Free dryer – in unit" } },
      { icon: "wardrobe", label: { el: "Ντουλάπα για τα ρούχα", en: "Clothing storage: wardrobe" } },
      { icon: "hangers", label: { el: "Κρεμάστρες", en: "Hangers" } },
      { icon: "bedlinen", label: { el: "Κλινοσκεπάσματα", en: "Bed linen" } },
      { icon: "bedlinen", label: { el: "Βαμβακερά λευκά είδη", en: "Cotton linen" } },
      { icon: "pillows", label: { el: "Επιπλέον μαξιλάρια και κουβέρτες", en: "Extra pillows and blankets" } },
      { icon: "blinds", label: { el: "Συσκοτιστικές περσίδες (black-out)", en: "Black-out blinds" } },
      { icon: "socket", label: { el: "Πρίζα κοντά στο κρεβάτι", en: "Power socket near the bed" } },
      { icon: "iron", label: { el: "Σίδερο", en: "Iron" } },
      { icon: "rack", label: { el: "Απλώστρα ρούχων", en: "Drying rack for clothing" } },
      { icon: "crib", label: { el: "Βρεφική κούνια – δωρεάν, για παιδιά 0–2 ετών", en: "Baby cot – free, for children aged 0–2" } },
    ],
  },
  {
    id: "living",
    title: { el: "Σαλόνι", en: "Living room" },
    items: [
      { icon: "sofa", label: { el: "Καναπές", en: "Sofa" } },
      { icon: "sofabed", label: { el: "Καναπές-κρεβάτι", en: "Sofa bed" } },
    ],
  },
  {
    id: "entertainment",
    title: { el: "Ψυχαγωγία και internet", en: "Entertainment and internet" },
    items: [
      { icon: "tv", label: { el: "Τηλεόραση επίπεδης οθόνης", en: "Flat-screen TV" } },
      { icon: "tv", label: { el: "Καλωδιακά κανάλια", en: "Cable channels" } },
      { icon: "wifi", label: { el: "Δωρεάν Wi-Fi σε όλους τους χώρους", en: "Free Wi-Fi throughout" } },
    ],
  },
  {
    id: "climate",
    title: { el: "Θέρμανση και δροσισμός", en: "Heating and cooling" },
    items: [
      { icon: "ac", label: { el: "Κλιματισμός (split)", en: "AC – split-type ductless system" } },
      { icon: "heating", label: { el: "Θέρμανση (split)", en: "Heating – split-type ductless system" } },
    ],
  },
  {
    id: "safety",
    title: { el: "Ασφάλεια", en: "Home safety" },
    items: [
      { icon: "smoke", label: { el: "Ανιχνευτής καπνού", en: "Smoke alarm" } },
      { icon: "extinguisher", label: { el: "Πυροσβεστήρας", en: "Fire extinguisher" } },
      { icon: "firstaid", label: { el: "Κουτί πρώτων βοηθειών", en: "First aid kit" } },
    ],
  },
  {
    id: "kitchen",
    title: { el: "Κουζίνα και τραπεζαρία", en: "Kitchen and dining" },
    items: [
      { icon: "fridge", label: { el: "Ψυγείο", en: "Refrigerator" } },
      { icon: "stove", label: { el: "Επαγωγική εστία", en: "Induction stove" } },
      { icon: "coffee", label: { el: "Καφετιέρα espresso", en: "Coffee maker: espresso machine" } },
      { icon: "coffee", label: { el: "Καφές", en: "Coffee" } },
      { icon: "kettle", label: { el: "Ηλεκτρικός βραστήρας", en: "Electric kettle" } },
      { icon: "cooking", label: { el: "Βασικά μαγειρικής: κατσαρόλες και τηγάνια, λάδι, αλάτι και πιπέρι", en: "Cooking basics: pots and pans, oil, salt and pepper" } },
      { icon: "dishes", label: { el: "Πιάτα, μπολ, φλιτζάνια, μαχαιροπήρουνα και άλλα σκεύη", en: "Plates, bowls, cups, cutlery and other utensils" } },
      { icon: "wine", label: { el: "Ποτήρια κρασιού", en: "Wine glasses" } },
      { icon: "kitchenette", label: { el: "Μικρή κουζίνα (kitchenette) – χώρος για να ζεστάνετε και να φυλάξετε φαγητό στο ψυγείο", en: "Kitchenette – space where guests can heat up and refrigerate food" } },
      { icon: "dining", label: { el: "Τραπεζαρία", en: "Dining table" } },
    ],
  },
  {
    id: "property",
    title: { el: "Το κατάλυμα", en: "The property" },
    items: [
      { icon: "entrance", label: { el: "Ιδιωτική είσοδος – ξεχωριστή είσοδος από τον δρόμο ή το κτίριο", en: "Private entrance – separate street or building entrance" } },
      { icon: "building", label: { el: "Αυτόνομο κτίριο", en: "Standalone building" } },
      { icon: "soundproof", label: { el: "Ηχομόνωση", en: "Soundproofing" } },
      { icon: "floor", label: { el: "Δάπεδο από πλακάκι/μάρμαρο", en: "Tile/marble floor" } },
      { icon: "nosmoking", label: { el: "Δωμάτια για μη καπνίζοντες", en: "Non-smoking rooms" } },
    ],
  },
  {
    id: "outdoor",
    title: { el: "Εξωτερικός χώρος", en: "Outdoor" },
    items: [
      { icon: "courtyard", label: { el: "Κοινόχρηστη αυλή – πλήρως περιφραγμένη", en: "Shared courtyard – fully fenced" } },
      { icon: "courtyard", label: { el: "Αίθριο", en: "Patio" } },
      { icon: "terrace", label: { el: "Βεράντα", en: "Terrace" } },
      { icon: "garden", label: { el: "Κήπος", en: "Garden" } },
      { icon: "outdoorfurniture", label: { el: "Έπιπλα εξωτερικού χώρου", en: "Outdoor furniture" } },
      { icon: "outdoordining", label: { el: "Χώρος φαγητού σε εξωτερικό χώρο", en: "Outdoor dining area" } },
      { icon: "bbq", label: { el: "Ψησταριά (BBQ)", en: "BBQ" } },
    ],
  },
  {
    id: "parking",
    title: { el: "Πάρκινγκ", en: "Parking and facilities" },
    items: [
      { icon: "parking", label: { el: "Ιδιωτικό πάρκινγκ δωρεάν στον χώρο του καταλύματος – δεν απαιτείται κράτηση", en: "Free private parking on site – no reservation needed" } },
    ],
  },
  {
    id: "services",
    title: { el: "Υπηρεσίες", en: "Services" },
    items: [
      { icon: "longstay", label: { el: "Επιτρέπονται μακροχρόνιες διαμονές (28 ημέρες ή περισσότερο)", en: "Long-term stays allowed (28 days or more)" } },
      { icon: "host", label: { el: "Ο οικοδεσπότης σας υποδέχεται", en: "Host greets you" } },
      { icon: "languages", label: { el: "Επικοινωνία στα ελληνικά και στα αγγλικά", en: "Greek and English spoken" } },
    ],
  },
]

export type HouseRuleIcon =
  | "checkin"
  | "quiet"
  | "smoking"
  | "parties"
  | "pets"
  | "children"
  | "crib"

/** Κανόνες καταλύματος, όπως αναγράφονται στο Booking.com */
export const houseRules: {
  icon: HouseRuleIcon
  title: Localized
  text: Localized
}[] = [
  {
    icon: "checkin",
    title: { el: "Άφιξη και αναχώρηση", en: "Check-in and check-out" },
    text: {
      el: `Check-in από τις ${property.checkIn} και check-out έως τις ${property.checkOut}. Ενημερώστε μας εκ των προτέρων για την ώρα άφιξής σας.`,
      en: `Check-in from ${property.checkIn}, check-out by ${property.checkOut}. Please let us know your arrival time in advance.`,
    },
  },
  {
    icon: "quiet",
    title: { el: "Ώρες ησυχίας", en: "Quiet hours" },
    text: {
      el: "Από τις 23:00 έως τις 07:00.",
      en: "From 23:00 to 07:00.",
    },
  },
  {
    icon: "smoking",
    title: { el: "Κάπνισμα", en: "Smoking" },
    text: {
      el: "Δεν επιτρέπεται το κάπνισμα σε κανέναν χώρο.",
      en: "Smoking is not allowed anywhere on the property.",
    },
  },
  {
    icon: "parties",
    title: { el: "Πάρτι και εκδηλώσεις", en: "Parties and events" },
    text: {
      el: "Δεν επιτρέπονται πάρτι και εκδηλώσεις.",
      en: "Parties and events are not allowed.",
    },
  },
  {
    icon: "pets",
    title: { el: "Κατοικίδια", en: "Pets" },
    text: { el: "Δεν επιτρέπονται κατοικίδια.", en: "Pets are not allowed." },
  },
  {
    icon: "children",
    title: { el: "Παιδιά", en: "Children" },
    text: {
      el: "Γίνονται δεκτά παιδιά όλων των ηλικιών. Τα παιδιά 3 ετών και άνω χρεώνονται ως ενήλικες.",
      en: "Children of all ages are welcome. Children aged 3 and over are charged as adults.",
    },
  },
  {
    icon: "crib",
    title: { el: "Βρεφική κούνια", en: "Baby cot" },
    text: {
      el: "Για παιδιά 0–2 ετών: πάντα διαθέσιμη και δωρεάν. Δεν υπάρχουν επιπλέον κρεβάτια.",
      en: "For children aged 0–2: always available, free of charge. No extra beds are available.",
    },
  },
]

/**
 * Βαθμολογίες ανά πλατφόρμα. Κάθε πλατφόρμα έχει διαφορετική κλίμακα.
 *  - Airbnb: 5.0/5 από 4 κριτικές (όπως εμφανίζεται στη σελίδα του καταλύματος).
 *  - Booking.com: 9,9/10 — ΥΠΟΛΟΓΙΣΜΕΝΟ από τις 10 κριτικές που έχουν επικολληθεί
 *    (εννέα με 10 και μία με 9,0). Αν στο Booking εμφανίζεται άλλη συνολική βαθμολογία
 *    ή περισσότερες κριτικές, ενημερώστε εδώ το `score` και το `count`.
 */
export const ratings = [
  {
    source: "Booking.com",
    score: 9.9,
    outOf: 10,
    count: 10,
    url: `${property.bookingUrl}#tab-reviews`,
  },
  {
    source: "Airbnb",
    score: 5.0,
    outOf: 5,
    count: 4,
    url: property.airbnbUrl,
  },
]

export function formatRating(score: number, locale: Locale) {
  return score.toLocaleString(locale === "el" ? "el-GR" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

/*
 * Οι κριτικές των επισκεπτών ΔΕΝ αναπαράγονται στο site (κείμενα και ονόματα τρίτων· οι όροι
 * του Booking.com/Airbnb και ο GDPR απαιτούν άδεια). Εμφανίζονται μόνο οι βαθμολογίες, με
 * σύνδεσμο προς τις κριτικές στις πλατφόρμες. Αν θέλετε να προσθέσετε κριτική, ζητήστε πρώτα
 * την άδεια του επισκέπτη.
 */

/** Συχνές ερωτήσεις (οι ερωτήσεις για το νοσοκομείο προστίθενται αυτόματα με τις αποστάσεις) */
export const faq: { q: Localized; a: Localized }[] = [
  {
    q: { el: "Υπάρχει χώρος στάθμευσης;", en: "Is there parking?" },
    a: {
      el: "Ναι — το κατάλυμα διαθέτει πάρκινγκ, κάτι που βοηθά ιδιαίτερα όσους πηγαινοέρχονται στο νοσοκομείο.",
      en: "Yes — the property has parking, which is especially helpful if you are going back and forth to the hospital.",
    },
  },
  {
    q: { el: "Πώς μπορώ να κάνω κράτηση;", en: "How can I book?" },
    a: {
      el: "Επιλέξτε ημερομηνίες στο ημερολόγιο και στείλτε αίτημα κράτησης μέσω Viber, καλέστε μας στο 694 287 8689, ή κάντε κράτηση μέσω Booking.com ή Airbnb.",
      en: "Pick your dates in the calendar and send a booking request via Viber, call us on +30 694 287 8689, or book through Booking.com or Airbnb.",
    },
  },
]

export function formatPrice(amount: number, locale: Locale, decimals = 0) {
  return new Intl.NumberFormat(locale === "el" ? "el-GR" : "en-GB", {
    style: "currency",
    currency: pricing.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}
