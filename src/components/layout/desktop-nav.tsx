"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { navItems, sectionIds } from "./nav-items"
import { ScrollLink, useActiveSection } from "./scroll-link"

export function DesktopNav() {
  const t = useTranslations("Nav")
  const active = useActiveSection(sectionIds)

  return (
    <nav aria-label={t("menu")} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => (
          <li key={item.id}>
            <ScrollLink
              href={item.href}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active === item.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t(item.id)}
            </ScrollLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
