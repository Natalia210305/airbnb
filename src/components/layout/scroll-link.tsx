"use client"

import {
  useEffect,
  useState,
  type ComponentProps,
  type MouseEvent,
} from "react"
import { Link, usePathname } from "@/i18n/navigation"

/** Ομαλή κύλιση σε ενότητα (ή στην κορυφή αν δεν δοθεί id), με σεβασμό στο reduced motion */
export function scrollToSection(id: string | null) {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth"
  const el = id ? document.getElementById(id) : null
  if (id && !el) return false
  if (el) el.scrollIntoView({ behavior, block: "start" })
  else window.scrollTo({ top: 0, behavior })
  history.replaceState(null, "", id ? `#${id}` : window.location.pathname)
  return true
}

/**
 * Εκτελεί το `fn` μόλις η σελίδα μπορεί να κυλήσει ξανά. Τα modals (π.χ. το
 * mobile μενού) κλειδώνουν το scroll και, όταν κλείνουν, επαναφέρουν την
 * προηγούμενη θέση — μια κύλιση πριν από αυτό θα ακυρωνόταν.
 */
export function whenScrollUnlocked(fn: () => void, maxFrames = 60) {
  const isLocked = () =>
    [document.documentElement, document.body].some((el) =>
      /hidden|clip/.test(getComputedStyle(el).overflowY),
    )
  const tick = (frame: number) => {
    if (isLocked() && frame < maxFrames)
      requestAnimationFrame(() => tick(frame + 1))
    else requestAnimationFrame(fn)
  }
  tick(0)
}

type ScrollLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** π.χ. "/#gallery" ή "/" */
  href: `/${string}`
  /**
   * Για μενού που πρέπει να κλείσουν πριν την κύλιση (π.χ. mobile Sheet,
   * που κλειδώνει το scroll όσο είναι ανοιχτό): λαμβάνει τη συνάρτηση κύλισης
   * και την εκτελεί όταν είναι έτοιμο.
   */
  deferScroll?: (scroll: () => void) => void
}

/**
 * Link προς ενότητα της αρχικής. Όταν είμαστε ήδη στην αρχική κάνει ομαλή κύλιση
 * χωρίς πλοήγηση· από άλλη σελίδα πλοηγείται κανονικά στο /#ενότητα.
 */
export function ScrollLink({
  href,
  deferScroll,
  onClick,
  ...props
}: ScrollLinkProps) {
  const pathname = usePathname()
  const [path, hash] = href.split("#")

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || pathname !== (path || "/")) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    const scroll = () => scrollToSection(hash ?? null)
    if (deferScroll) deferScroll(scroll)
    else scroll()
  }

  return <Link href={href} onClick={handleClick} {...props} />
}

/** Επιστρέφει το id της ενότητας που βρίσκεται αυτή τη στιγμή στο πάνω μέρος της οθόνης */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!elements.length) return

    const visible = new Map<string, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting)
        setActive(ids.find((id) => visible.get(id)) ?? null)
      },
      // «ζώνη» λίγο κάτω από το header: ενεργή είναι η ενότητα που την περνάει
      { rootMargin: "-80px 0px -55% 0px" },
    )
    elements.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  return active
}
