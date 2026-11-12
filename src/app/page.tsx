import { redirect } from "next/navigation"
import { routing } from "@/i18n/routing"

/**
 * Δίχτυ ασφαλείας για το βασικό URL ("/"). Κανονικά το middleware (next-intl)
 * ανακατευθύνει ήδη το "/" στη γλώσσα του επισκέπτη (/el ή /en). Αν για κάποιον λόγο
 * δεν τρέξει (π.χ. ρύθμιση hosting), ο επισκέπτης πηγαίνει στην προεπιλεγμένη γλώσσα
 * αντί για σελίδα 404.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}
