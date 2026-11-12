/**
 * Κείμενα των νομικών σελίδων (Πολιτική απορρήτου, Όροι κράτησης), ελληνικά και αγγλικά.
 * Περιγράφουν ό,τι κάνει ΠΡΑΓΜΑΤΙΚΑ η σελίδα. Αν προστεθεί κάτι νέο (π.χ. analytics, φόρμα
 * επικοινωνίας που στέλνει email, cookies), ενημερώστε εδώ ΠΡΙΝ το δημοσιεύσετε.
 *
 * ΣΗΜΕΙΩΣΗ: πρόκειται για σχέδιο που βασίζεται στη λειτουργία του site — δεν αποτελεί
 * νομική συμβουλή. Ελέγξτε το με λογιστή/νομικό και συμπληρώστε `operatorName` και
 * `contact.email` στο property.ts.
 */
import { fullAddress, houseRules, property, tr, type Localized } from "./property"

export type LegalBlock =
  | { type: "p"; text: Localized }
  | { type: "ul"; items: Localized[] }

export type LegalSection = { title: Localized; blocks: LegalBlock[] }

export type LegalDoc = {
  title: Localized
  updated: Localized
  intro: Localized
  sections: LegalSection[]
}

const L = (el: string, en: string): Localized => ({ el, en })
const p = (el: string, en: string): LegalBlock => ({ type: "p", text: L(el, en) })
const ul = (...items: [string, string][]): LegalBlock => ({
  type: "ul",
  items: items.map(([el, en]) => L(el, en)),
})

const UPDATED = L("Τελευταία ενημέρωση: 12 Νοεμβρίου 2026", "Last updated: 12 November 2026")

const controller = property.operatorName
  ? `${property.operatorName} (${property.name})`
  : property.name
const emailEl = property.contact.email ? `, email: ${property.contact.email}` : ""
const emailEn = property.contact.email ? `, email: ${property.contact.email}` : ""
const address = { el: fullAddress("el"), en: fullAddress("en") }

export const privacyPolicy: LegalDoc = {
  title: L("Πολιτική απορρήτου", "Privacy policy"),
  updated: UPDATED,
  intro: L(
    "Σεβόμαστε τα προσωπικά σας δεδομένα. Εδώ εξηγούμε με απλά λόγια ποια δεδομένα επεξεργαζόμαστε όταν επισκέπτεστε αυτή τη σελίδα ή επικοινωνείτε μαζί μας, γιατί, και ποια είναι τα δικαιώματά σας, σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (ΕΕ 2016/679, «GDPR»).",
    "We respect your personal data. Here we explain in plain language which data we process when you visit this website or contact us, why, and what your rights are under the General Data Protection Regulation (EU 2016/679, “GDPR”).",
  ),
  sections: [
    {
      title: L("Ποιος είναι υπεύθυνος για τα δεδομένα σας", "Who is responsible for your data"),
      blocks: [
        p(
          `Υπεύθυνος επεξεργασίας είναι ο φορέας εκμετάλλευσης του καταλύματος ${controller}, ${address.el}, ΑΜΑ ${property.amaNumber}, τηλ. ${property.contact.phoneDisplay}${emailEl}. Για κάθε θέμα που αφορά τα προσωπικά σας δεδομένα επικοινωνήστε μαζί μας με τα παραπάνω στοιχεία.`,
          `The data controller is the operator of the accommodation ${controller}, ${address.en}, registry no. (AMA) ${property.amaNumber}, tel. ${property.contact.phoneDisplay}${emailEn}. For any matter concerning your personal data, please contact us using the details above.`,
        ),
      ],
    },
    {
      title: L("Τι δεδομένα επεξεργαζόμαστε και γιατί", "What data we process and why"),
      blocks: [
        ul(
          [
            "Επικοινωνία και αιτήματα κράτησης (Viber, τηλέφωνο): όνομα, αριθμός τηλεφώνου ή λογαριασμός Viber, ημερομηνίες διαμονής, αριθμός επισκεπτών και το μήνυμά σας. Τα χρησιμοποιούμε για να σας απαντήσουμε και να διαχειριστούμε την κράτησή σας. Νομική βάση: μέτρα που λαμβάνονται κατόπιν αιτήματός σας πριν από τη σύναψη σύμβασης και εκτέλεση της σύμβασης (άρθρο 6 παρ. 1 β΄ GDPR).",
            "Communication and booking requests (Viber, phone): name, phone number or Viber account, stay dates, number of guests and your message. We use them to reply and to manage your booking. Legal basis: steps taken at your request before entering into a contract, and performance of the contract (Article 6(1)(b) GDPR).",
          ],
          [
            "Κράτηση μέσω Booking.com ή Airbnb: τα στοιχεία της κράτησής σας τα παραλαμβάνουμε από την πλατφόρμα για να σας φιλοξενήσουμε. Η πλατφόρμα έχει τη δική της πολιτική απορρήτου.",
            "Booking via Booking.com or Airbnb: we receive your booking details from the platform in order to host you. The platform has its own privacy policy.",
          ],
          [
            "Νομικές υποχρεώσεις: τα στοιχεία που απαιτεί η νομοθεσία για τη φιλοξενία και τη φορολογία (άρθρο 6 παρ. 1 γ΄ GDPR).",
            "Legal obligations: the data required by law for hosting and taxation (Article 6(1)(c) GDPR).",
          ],
          [
            "Τεχνικά δεδομένα της επίσκεψής σας: διεύθυνση IP, τύπος προγράμματος περιήγησης και ώρα πρόσβασης καταγράφονται από τον πάροχο φιλοξενίας της σελίδας για τη λειτουργία και την ασφάλειά της (έννομο συμφέρον, άρθρο 6 παρ. 1 στ΄ GDPR).",
            "Technical data about your visit: IP address, browser type and access time are recorded by the website's hosting provider for its operation and security (legitimate interest, Article 6(1)(f) GDPR).",
          ],
        ),
      ],
    },
    {
      title: L("Τι δεν κάνουμε", "What we do not do"),
      blocks: [
        ul(
          [
            "Το κουτί κράτησης της σελίδας δεν στέλνει τα στοιχεία που συμπληρώνετε σε διακομιστή μας: χρησιμοποιούνται μόνο στο πρόγραμμα περιήγησής σας για να συντάξουν το μήνυμα, το οποίο εσείς στέλνετε μέσω Viber.",
            "The booking box on this website does not send the details you enter to our server: they are only used in your browser to compose the message, which you then send yourself via Viber.",
          ],
          [
            "Δεν χρησιμοποιούμε εργαλεία στατιστικών, διαφήμισης ή παρακολούθησης.",
            "We do not use analytics, advertising or tracking tools.",
          ],
          [
            "Δεν πουλάμε τα δεδομένα σας και δεν τα μοιραζόμαστε για διαφημιστικούς σκοπούς.",
            "We do not sell your data and do not share it for advertising purposes.",
          ],
        ),
      ],
    },
    {
      title: L("Cookies", "Cookies"),
      blocks: [
        p(
          "Η σελίδα χρησιμοποιεί ένα μόνο τεχνικό cookie, το NEXT_LOCALE, που θυμάται τη γλώσσα που επιλέξατε. Είναι απαραίτητο για τη λειτουργία της σελίδας και λήγει όταν κλείσετε το πρόγραμμα περιήγησης, γι' αυτό δεν ζητάμε συγκατάθεση. Δεν χρησιμοποιούμε cookies στατιστικών ή διαφήμισης.",
          "This website uses a single technical cookie, NEXT_LOCALE, which remembers the language you chose. It is necessary for the website to work and expires when you close your browser, so we do not ask for consent. We do not use analytics or advertising cookies.",
        ),
      ],
    },
    {
      title: L("Τρίτοι και μεταφορά δεδομένων", "Third parties and data transfers"),
      blocks: [
        ul(
          [
            "Vercel Inc. (φιλοξενία της σελίδας): επεξεργάζεται τεχνικά δεδομένα σύμφωνα με τη δική της πολιτική απορρήτου και μπορεί να τα μεταφέρει σε χώρες εκτός του Ευρωπαϊκού Οικονομικού Χώρου με τις εγγυήσεις που προβλέπει ο GDPR.",
            "Vercel Inc. (website hosting): processes technical data under its own privacy policy and may transfer it outside the European Economic Area with the safeguards required by the GDPR.",
          ],
          [
            "OpenStreetMap (χάρτης): για να εμφανιστεί ο διαδραστικός χάρτης, το πρόγραμμα περιήγησής σας ζητά τα τμήματα του χάρτη από διακομιστές του OpenStreetMap, που βλέπουν τη διεύθυνση IP σας. Πολιτική απορρήτου: https://osmfoundation.org/wiki/Privacy_Policy",
            "OpenStreetMap (map): to display the interactive map, your browser requests map tiles from OpenStreetMap servers, which can see your IP address. Privacy policy: https://osmfoundation.org/wiki/Privacy_Policy",
          ],
          [
            "Google Maps, Booking.com, Airbnb, Viber: ανοίγουν μόνο όταν επιλέξετε σχετικό σύνδεσμο ή κουμπί και διέπονται από τις δικές τους πολιτικές απορρήτου.",
            "Google Maps, Booking.com, Airbnb, Viber: these open only when you choose the relevant link or button and are governed by their own privacy policies.",
          ],
        ),
      ],
    },
    {
      title: L("Για πόσο διατηρούμε τα δεδομένα", "How long we keep data"),
      blocks: [
        p(
          "Διατηρούμε τα στοιχεία επικοινωνίας και κράτησης μόνο για όσο χρειάζεται για την εξυπηρέτησή σας και για όσο απαιτούν οι φορολογικές και άλλες νομικές υποχρεώσεις. Τα τεχνικά αρχεία (logs) διατηρούνται για περιορισμένο χρονικό διάστημα από τον πάροχο φιλοξενίας.",
          "We keep contact and booking details only for as long as needed to serve you and as required by tax and other legal obligations. Technical logs are kept for a limited period by the hosting provider.",
        ),
      ],
    },
    {
      title: L("Τα δικαιώματά σας", "Your rights"),
      blocks: [
        ul(
          ["Πρόσβαση στα δεδομένα σας και αντίγραφο.", "Access to your data and a copy of it."],
          ["Διόρθωση ανακριβών δεδομένων.", "Rectification of inaccurate data."],
          ["Διαγραφή, όπου δεν υπάρχει νομική υποχρέωση διατήρησης.", "Erasure, where there is no legal obligation to keep it."],
          ["Περιορισμός της επεξεργασίας και εναντίωση σε αυτήν.", "Restriction of processing and objection to it."],
          ["Φορητότητα των δεδομένων σας.", "Data portability."],
        ),
        p(
          "Για να ασκήσετε τα δικαιώματά σας, επικοινωνήστε μαζί μας. Έχετε επίσης δικαίωμα να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr).",
          "To exercise your rights, please contact us. You also have the right to lodge a complaint with the Hellenic Data Protection Authority (www.dpa.gr).",
        ),
      ],
    },
    {
      title: L("Αλλαγές σε αυτή την πολιτική", "Changes to this policy"),
      blocks: [
        p(
          "Αν αλλάξει κάτι στον τρόπο που επεξεργαζόμαστε δεδομένα, θα ενημερώσουμε αυτή τη σελίδα και την ημερομηνία τελευταίας ενημέρωσης.",
          "If anything changes in how we process data, we will update this page and its last-updated date.",
        ),
      ],
    },
  ],
}

const rulesList: LegalBlock = {
  type: "ul",
  items: houseRules.map((r) => ({
    el: `${tr(r.title, "el")}: ${tr(r.text, "el")}`,
    en: `${tr(r.title, "en")}: ${tr(r.text, "en")}`,
  })),
}

export const termsOfBooking: LegalDoc = {
  title: L("Όροι κράτησης", "Booking terms"),
  updated: UPDATED,
  intro: L(
    `Οι παρακάτω όροι εξηγούν πώς λειτουργεί η κράτηση στο ${property.name}. Αν κάνετε κράτηση μέσω Booking.com ή Airbnb, ισχύουν επιπλέον οι όροι της πλατφόρμας και όσα αναγράφονται στην επιβεβαίωσή σας.`,
    `The terms below explain how booking works at ${property.name}. If you book through Booking.com or Airbnb, the platform's terms and what is stated in your confirmation also apply.`,
  ),
  sections: [
    {
      title: L("Πώς γίνεται κράτηση", "How to book"),
      blocks: [
        ul(
          ["Μέσω Booking.com ή Airbnb, από τους συνδέσμους της σελίδας.", "Through Booking.com or Airbnb, using the links on this website."],
          ["Με αίτημα απευθείας σε εμάς: επιλέξτε ημερομηνίες στο ημερολόγιο και στείλτε αίτημα μέσω Viber ή τηλεφωνήστε μας.", "By requesting directly from us: pick your dates in the calendar and send a request via Viber, or call us."],
          ["Το αίτημα δεν αποτελεί επιβεβαιωμένη κράτηση. Η κράτηση ισχύει μόνο όταν την επιβεβαιώσει ο οικοδεσπότης.", "A request is not a confirmed booking. A booking is valid only once the host confirms it."],
        ),
      ],
    },
    {
      title: L("Διαθεσιμότητα και τιμές", "Availability and prices"),
      blocks: [
        p(
          "Το ημερολόγιο ενημερώνεται περιοδικά από τις πλατφόρμες και είναι ενδεικτικό· η διαθεσιμότητα και η τελική τιμή επιβεβαιώνονται από τον οικοδεσπότη. Η τελική τιμή μπορεί να περιλαμβάνει το νόμιμο τέλος ανθεκτικότητας στην κλιματική κρίση.",
          "The calendar is updated periodically from the platforms and is indicative; availability and the final price are confirmed by the host. The final price may include the statutory climate crisis resilience fee.",
        ),
      ],
    },
    {
      title: L("Άφιξη και αναχώρηση", "Arrival and departure"),
      blocks: [
        p(
          `Check-in από τις ${property.checkIn} και check-out έως τις ${property.checkOut}. Ενημερώστε μας εκ των προτέρων για την ώρα άφιξής σας.`,
          `Check-in from ${property.checkIn} and check-out by ${property.checkOut}. Please let us know your arrival time in advance.`,
        ),
      ],
    },
    {
      title: L("Κανόνες καταλύματος", "House rules"),
      blocks: [rulesList],
    },
    {
      title: L("Ακύρωση και προπληρωμή", "Cancellation and prepayment"),
      blocks: [
        p(
          "Οι όροι ακύρωσης και προπληρωμής εξαρτώνται από τον τρόπο κράτησης και την επιλογή που κάνατε. Ισχύουν όσα αναγράφονται στην επιβεβαίωση της κράτησής σας. Για κρατήσεις μέσω Booking.com ή Airbnb ισχύουν οι όροι της αντίστοιχης πλατφόρμας.",
          "Cancellation and prepayment terms depend on how you book and the option you chose. What is stated in your booking confirmation applies. For bookings through Booking.com or Airbnb, the terms of the respective platform apply.",
        ),
      ],
    },
    {
      title: L("Επικοινωνία", "Contact"),
      blocks: [
        p(
          `${property.name}, ${address.el}, τηλ. ${property.contact.phoneDisplay}${emailEl}.`,
          `${property.name}, ${address.en}, tel. ${property.contact.phoneDisplay}${emailEn}.`,
        ),
      ],
    },
  ],
}
