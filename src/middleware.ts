import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Όλα εκτός από api, _next, _vercel και αρχεία με κατάληξη (π.χ. .ics, .png)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}
