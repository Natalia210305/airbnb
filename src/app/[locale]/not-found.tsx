import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  const t = useTranslations("NotFound")

  return (
    <section className="container-page flex flex-col items-center gap-6 py-32 text-center">
      <p className="font-heading text-7xl font-semibold text-primary">404</p>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        {t("back")}
      </Link>
    </section>
  )
}
