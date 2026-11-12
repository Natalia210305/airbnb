"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CalendarCheckIcon,
  CalendarDaysIcon,
  ExternalLinkIcon,
  LoaderCircleIcon,
  MinusIcon,
  PhoneIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { DateRange } from "react-day-picker"
import { el as elLocale, enGB } from "react-day-picker/locale"
import type { Locale } from "@/i18n/routing"
import { formatPrice, pricing, property, tr } from "@/content/property"
import { Calendar } from "@/components/ui/calendar"
import { buttonVariants } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { contactLinks } from "@/lib/contact"
import {
  fromISODate,
  nightsBetween,
  toISODate,
  type ISODate,
} from "@/lib/dates"
import { quote } from "@/lib/pricing"
import { cn } from "@/lib/utils"

type Availability = { booked: ISODate[]; synced: boolean }

const purposes = [
  "purposeLeisure",
  "purposeCompanion",
  "purposeMedical",
  "purposeAppointment",
  "purposeWork",
] as const

export function BookingWidget() {
  const t = useTranslations("Booking")
  const locale = useLocale() as Locale
  const isWide = useMediaQuery("(min-width: 768px)")

  const [availability, setAvailability] = useState<Availability | null>(null)
  const [range, setRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(1)
  const [name, setName] = useState("")
  const [purpose, setPurpose] = useState<(typeof purposes)[number] | null>(null)
  const [notes, setNotes] = useState("")
  const [viberCopied, setViberCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch("/api/availability")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Availability) => !cancelled && setAvailability(data))
      .catch(() => !cancelled && setAvailability({ booked: [], synced: false }))
    return () => {
      cancelled = true
    }
  }, [])

  const booked = useMemo(
    () => new Set(availability?.booked ?? []),
    [availability],
  )
  const today = toISODate(new Date())
  const checkIn = range?.from ? toISODate(range.from) : null
  const checkOut = range?.to ? toISODate(range.to) : null
  const pickingCheckOut = checkIn !== null && checkOut === null

  /** Η πρώτη κλεισμένη νύχτα μετά το check-in: εκείνη τη μέρα μπορεί να γίνει check-out, όχι αργότερα */
  const firstBookedAfterCheckIn = useMemo(() => {
    if (!checkIn) return null
    return availability?.booked.find((n) => n > checkIn) ?? null
  }, [availability, checkIn])

  const isDisabled = (date: Date) => {
    const iso = toISODate(date)
    if (iso < today) return true
    if (!pickingCheckOut || iso <= checkIn!) return booked.has(iso)
    if (nightsBetween(checkIn!, iso) < pricing.minNights) return true
    return firstBookedAfterCheckIn !== null && iso > firstBookedAfterCheckIn
  }

  const handleSelect = (_: DateRange | undefined, day: Date) => {
    const iso = toISODate(day)
    if (!pickingCheckOut || iso <= checkIn!)
      setRange({ from: day, to: undefined })
    else setRange({ from: range!.from, to: day })
  }

  const q = checkIn && checkOut ? quote(checkIn, checkOut, pricing) : null
  const fmt = (n: number) => formatPrice(n, locale, Number.isInteger(n) ? 0 : 2)
  const dateFmt = new Intl.DateTimeFormat(locale === "el" ? "el-GR" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const message = (() => {
    const lines = [
      t(q ? "msgGreeting" : "msgInquiry", { name: property.name }),
      "",
    ]
    if (q && checkIn && checkOut) {
      lines.push(
        `📅 ${t("msgCheckIn", { date: dateFmt.format(fromISODate(checkIn)) })}`,
        `📅 ${t("msgCheckOut", {
          date: dateFmt.format(fromISODate(checkOut)),
          nights: t("nights", { count: q.nights }),
        })}`,
        `👥 ${t("msgGuests", { count: guests })}`,
        `💶 ${t("msgTotal", { total: fmt(q.total) })}`,
      )
    }
    if (name.trim()) lines.push(`🙋 ${t("msgName", { name: name.trim() })}`)
    if (purpose) lines.push(`ℹ️ ${t("msgPurpose", { purpose: t(purpose) })}`)
    if (notes.trim()) lines.push(`💬 ${t("msgNotes", { notes: notes.trim() })}`)
    return lines.join("\n")
  })()

  const openViber = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setViberCopied(true)
      setTimeout(() => setViberCopied(false), 6000)
    } catch {
      /* χωρίς πρόσβαση στο πρόχειρο — ανοίγει απλώς η συνομιλία */
    }
    window.location.href = contactLinks.viber
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
      {/* Ημερολόγιο */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-medium">
            <CalendarDaysIcon className="size-5 text-primary" />
            {pickingCheckOut ? t("pickCheckOut") : t("pickCheckIn")}
          </p>
          {range?.from && (
            <button
              type="button"
              onClick={() => setRange(undefined)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <XIcon className="size-4" />
              {t("clear")}
            </button>
          )}
        </div>

        <div className="relative">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={isDisabled}
            numberOfMonths={isWide ? 2 : 1}
            showOutsideDays={false}
            startMonth={new Date()}
            endMonth={new Date(new Date().getFullYear() + 1, 11)}
            locale={locale === "el" ? elLocale : enGB}
            weekStartsOn={1}
            modifiers={{ booked: (d) => booked.has(toISODate(d)) }}
            modifiersClassNames={{
              booked:
                "[&_button]:line-through [&_button]:decoration-muted-foreground/60",
            }}
            className="mx-auto w-full bg-transparent p-0 [--cell-size:--spacing(10)] sm:[--cell-size:--spacing(11)]"
            classNames={{
              root: "w-full",
              months:
                "relative flex w-full flex-col justify-center gap-8 md:flex-row",
            }}
          />
          {!availability && (
            <div className="absolute inset-0 grid place-items-center bg-card/70">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircleIcon className="size-4 animate-spin" />
                {t("loading")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <Legend className="border border-border bg-background">
            {t("legendAvailable")}
          </Legend>
          <Legend className="bg-muted line-through">{t("legendBooked")}</Legend>
          <Legend className="bg-primary">{t("legendSelected")}</Legend>
          {pricing.minNights > 1 && (
            <span>{t("minNights", { count: pricing.minNights })}</span>
          )}
        </div>
        {availability && !availability.synced && (
          <p className="mt-3 text-xs text-muted-foreground">{t("notSynced")}</p>
        )}
      </div>

      {/* Σύνοψη & αίτημα */}
      <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-[0_20px_60px_-30px_rgba(60,85,55,0.35)] sm:p-6 lg:sticky lg:top-24">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border">
          <DateTile
            label={t("checkIn")}
            value={
              checkIn ? dateFmt.format(fromISODate(checkIn)) : t("addDate")
            }
            muted={!checkIn}
          />
          <DateTile
            label={t("checkOut")}
            value={
              checkOut ? dateFmt.format(fromISODate(checkOut)) : t("addDate")
            }
            muted={!checkOut}
            className="border-l border-border"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t("guests")}</span>
          <div className="flex items-center gap-3">
            <StepButton
              label={t("decrease")}
              disabled={guests <= 1}
              onClick={() => setGuests((g) => g - 1)}
            >
              <MinusIcon className="size-4" />
            </StepButton>
            <span
              className="w-5 text-center font-medium tabular-nums"
              aria-live="polite"
            >
              {guests}
            </span>
            <StepButton
              label={t("increase")}
              disabled={guests >= pricing.maxGuests}
              onClick={() => setGuests((g) => g + 1)}
            >
              <PlusIcon className="size-4" />
            </StepButton>
          </div>
        </div>

        {/* Κόστος */}
        <div className="border-t border-border pt-4" aria-live="polite">
          {q ? (
            <dl className="space-y-2 text-sm">
              {q.lines.map((line, i) => (
                <Row
                  key={i}
                  label={
                    t("nightsLine", {
                      price: fmt(line.perNight),
                      count: line.nights,
                    }) + (line.season ? ` · ${tr(line.season, locale)}` : "")
                  }
                  value={fmt(line.perNight * line.nights)}
                />
              ))}
              {q.discount > 0 && (
                <Row
                  label={t("weeklyDiscount", {
                    pct: pricing.weeklyDiscountPct,
                  })}
                  value={`−${fmt(q.discount)}`}
                  className="text-accent-foreground"
                />
              )}
              {q.cleaningFee > 0 && (
                <Row label={t("cleaning")} value={fmt(q.cleaningFee)} />
              )}
              {q.climateFee > 0 && (
                <Row label={t("climateFee")} value={fmt(q.climateFee)} />
              )}
              <div className="flex items-baseline justify-between border-t border-border pt-3 text-base font-semibold">
                <dt>
                  {t("total")}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    · {t("nights", { count: q.nights })}
                  </span>
                </dt>
                <dd className="text-2xl font-bold tabular-nums">
                  {fmt(q.total)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("selectDatesForPrice")}
            </p>
          )}
          {pricing.isPlaceholder && (
            <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs text-secondary-foreground">
              {t("placeholderPrices")}
            </p>
          )}
        </div>

        {/* Στοιχεία αιτήματος */}
        <div className="space-y-3 border-t border-border pt-4">
          <p className="font-heading text-lg font-semibold">
            {t("requestTitle")}
          </p>
          <Field label={t("name")}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              className={inputClass}
            />
          </Field>
          <fieldset>
            <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
              {t("purpose")}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {purposes.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={purpose === p}
                  onClick={() => setPurpose(purpose === p ? null : p)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors",
                    purpose === p
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {t(p)}
                </button>
              ))}
            </div>
          </fieldset>
          <Field label={t("notes")}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("notesPlaceholder")}
              rows={2}
              className={cn(inputClass, "h-auto resize-none py-2")}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={contactLinks.whatsapp(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1fa855] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#178a45]"
          >
            <WhatsAppIcon className="size-5" />
            {t("whatsapp")}
          </a>
          <button
            type="button"
            onClick={openViber}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7360f2] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5b49d6]"
          >
            <ViberIcon className="size-5" />
            {t("viber")}
          </button>
          {viberCopied && (
            <p
              role="status"
              className="text-center text-xs text-muted-foreground"
            >
              {t("viberCopied")}
            </p>
          )}
          <a
            href={contactLinks.tel}
            className={buttonVariants({
              variant: "outline",
              className: "h-12 gap-2 rounded-xl text-sm",
            })}
          >
            <PhoneIcon className="size-4" />
            {t("call", { phone: property.contact.phoneDisplay })}
          </a>
          <div className="mt-2 border-t border-border pt-4">
            <p className="mb-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <CalendarCheckIcon className="size-4" />
              {t("orBookOn")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Booking.com", href: property.bookingUrl },
                { name: "Airbnb", href: property.airbnbUrl },
              ].map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    className: "h-11 gap-1.5 rounded-xl text-sm",
                  })}
                >
                  {p.name}
                  <ExternalLinkIcon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {t("requestHint")}
          </p>
        </div>
      </div>
    </div>
  )
}

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

function Row({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4", className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}

function DateTile({
  label,
  value,
  muted,
  className,
}: {
  label: string
  value: string
  muted: boolean
  className?: string
}) {
  return (
    <div className={cn("px-4 py-3", className)}>
      <p className="text-[0.7rem] font-semibold tracking-wide uppercase">
        {label}
      </p>
      <p className={cn("text-sm", muted && "text-muted-foreground")}>{value}</p>
    </div>
  )
}

function StepButton({
  label,
  children,
  ...props
}: {
  label: string
  children: React.ReactNode
} & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-border transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      {...props}
    >
      {children}
    </button>
  )
}

function Legend({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-3.5 rounded", className)} />
      {children}
    </span>
  )
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2c.2-.6.2-1.1.1-1.2l-.5-.3Z" />
    </svg>
  )
}

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M11.4 1.5c-2 0-6.4.3-8.4 2.2C1.5 5.1 1 7.3.9 10c0 2.7-.1 7.7 4.7 9.1v2.1s0 .9.5 1c.7.2 1-.4 1.7-1.2l1.2-1.4c3.3.3 5.8-.4 6.1-.5.7-.2 4.4-.7 5-5.6.6-5.1-.3-8.3-2-9.8-.5-.5-2.6-2-7.2-2.2h-.5Zm.1 1.5h.4c3.9.1 5.7 1.3 6.1 1.7 1.4 1.2 2.1 4.1 1.6 8.4-.5 4.1-3.5 4.4-4 4.5-.3.1-2.4.6-5.1.5l-2.8 3.1v-3.3C3.8 16.7 3.9 12.4 4 10.1c0-2.3.5-4.1 1.7-5.2 1.6-1.5 5.1-1.9 5.8-1.9Zm.4 2.4a.3.3 0 0 0 0 .6 4.9 4.9 0 0 1 4.9 5 .3.3 0 0 0 .6 0 5.5 5.5 0 0 0-5.5-5.6Zm-3.4.9a1 1 0 0 0-.6.2l-.6.5c-.4.4-.6.8-.4 1.4a13.8 13.8 0 0 0 7.2 7.2c.5.2 1-.1 1.4-.4l.5-.6c.3-.4.2-.9-.2-1.2l-1.3-1c-.4-.2-.9-.2-1.2.1l-.4.5c-.2.2-.5.2-.5.2a4.7 4.7 0 0 1-3-3s0-.3.2-.5l.5-.4c.3-.3.3-.8.1-1.2l-1-1.3a1 1 0 0 0-.7-.4Zm3.5.3a.3.3 0 0 0 0 .6 3.3 3.3 0 0 1 3.2 3.4.3.3 0 0 0 .6 0 3.9 3.9 0 0 0-3.8-4Zm.1 1.6a.3.3 0 0 0 0 .6c.9 0 1.5.6 1.5 1.6a.3.3 0 0 0 .6 0 2.1 2.1 0 0 0-2.1-2.2Z" />
    </svg>
  )
}
