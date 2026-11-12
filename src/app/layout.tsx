import type { ReactNode } from "react"

/**
 * Ελάχιστο root layout: απαιτείται επειδή υπάρχει σελίδα στη ρίζα (src/app/page.tsx).
 * Τα <html>/<body>, οι γραμματοσειρές και το περιεχόμενο ορίζονται στο src/app/[locale]/layout.tsx.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
