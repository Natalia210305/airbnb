"use client"

import { useLocale, useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Nav")
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "inline-flex rounded-lg border border-border p-0.5 text-xs font-medium",
        className,
      )}
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "rounded-md px-2.5 py-1.5 uppercase transition-colors",
            l === locale
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </Link>
      ))}
    </div>
  )
}
