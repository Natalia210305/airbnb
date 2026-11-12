export function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-5 max-w-2xl sm:mb-10">
      <h2 className="text-2xl font-semibold sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
