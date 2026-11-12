import { useTranslations } from "next-intl"
import { property } from "@/content/property"
import { buttonVariants } from "@/components/ui/button"
import { DesktopNav } from "./desktop-nav"
import { ScrollLink } from "./scroll-link"
import { LanguageSwitcher } from "./language-switcher"
import { MobileNav } from "./mobile-nav"

export function SiteHeader() {
  const t = useTranslations("Nav")

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/65">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <ScrollLink
          href="/"
          className="font-heading text-xl font-semibold tracking-tight"
        >
          {property.shortName}
        </ScrollLink>

        <DesktopNav />

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <ScrollLink
            href="/#booking"
            className={buttonVariants({
              size: "lg",
              className: "hidden px-4 sm:inline-flex",
            })}
          >
            {t("book")}
          </ScrollLink>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
