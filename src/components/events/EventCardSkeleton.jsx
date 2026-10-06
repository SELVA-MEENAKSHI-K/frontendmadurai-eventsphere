export default function EventCardSkeleton() {
  return (
    <div
      className="bg-white dark:bg-brand-900 rounded-3xl border border-brand-100 dark:border-brand-800 overflow-hidden animate-pulse shadow-card"
      aria-hidden="true"
    >
      {/* Poster area */}
      <div className="h-44 bg-brand-100 dark:bg-brand-800" />

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Title bar */}
        <div className="h-4 bg-brand-100 dark:bg-brand-800 rounded-lg w-4/5" />
        {/* Date row */}
        <div className="h-3 bg-brand-100 dark:bg-brand-800 rounded-lg w-1/2" />
        {/* Venue row */}
        <div className="h-3 bg-brand-100 dark:bg-brand-800 rounded-lg w-2/3" />
        {/* Tag pills */}
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 bg-brand-100 dark:bg-brand-800 rounded-full" />
          <div className="h-5 w-14 bg-brand-100 dark:bg-brand-800 rounded-full" />
        </div>
      </div>
    </div>
  )
}
