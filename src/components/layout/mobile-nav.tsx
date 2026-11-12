"use client"

import { useRef, useState } from "react"
import { MenuIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { property } from "@/content/property"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navItems } from "./nav-items"
import { LanguageSwitcher } from "./language-switcher"
import { ScrollLink, whenScrollUnlocked } from "./scroll-link"

export function MobileNav() {
  const t = useTranslations("Nav")
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  // Το Sheet κλειδώνει το scroll όσο είναι ανοιχτό: η κύλιση γίνεται αφού κλείσει
  const pendingScroll = useRef<(() => void) | null>(null)

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(isOpen) => {
        const scroll = pendingScroll.current
        pendingScroll.current = null
        if (!isOpen && scroll) whenScrollUnlocked(scroll)
      }}
    >
      <SheetTrigger
        render={<Button variant="ghost" size="icon-lg" className="lg:hidden" />}
      >
        <MenuIcon className="size-5" />
        <span className="sr-only">{t("openMenu")}</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-sm">
        <SheetHeader>
          <SheetTitle className="text-lg">{property.shortName}</SheetTitle>
        </SheetHeader>
        <nav aria-label={t("menu")} className="px-4">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.id}>
                <ScrollLink
                  href={item.href}
                  onClick={close}
                  deferScroll={(scroll) => {
                    pendingScroll.current = scroll
                  }}
                  className="block border-b border-border/60 py-3 text-base"
                >
                  {t(item.id)}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-4 p-4">
          <LanguageSwitcher className="self-start" />
          <ScrollLink
            href="/#booking"
            onClick={close}
            deferScroll={(scroll) => {
              pendingScroll.current = scroll
            }}
            className={buttonVariants({ size: "lg", className: "h-11" })}
          >
            {t("book")}
          </ScrollLink>
        </div>
      </SheetContent>
    </Sheet>
  )
}
