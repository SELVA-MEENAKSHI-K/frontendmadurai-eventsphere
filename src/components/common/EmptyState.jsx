export default function EmptyState({
  title   = 'Nothing here yet',
  message = 'Try adjusting your filters or search term.',
  onClear,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Simplified gopuram silhouette — decorative, aria-hidden */}
      <div className="mb-6" aria-hidden="true">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-30 dark:opacity-20"
        >
          {/* Base platform */}
          <rect x="8" y="68" width="64" height="8" rx="2" fill="#7B1828" />
          {/* Lower tier */}
          <rect x="16" y="56" width="48" height="14" rx="2" fill="#7B1828" />
          {/* Mid tier */}
          <rect x="22" y="44" width="36" height="14" rx="2" fill="#7B1828" />
          {/* Upper tier */}
          <rect x="28" y="32" width="24" height="14" rx="2" fill="#7B1828" />
          {/* Top spire */}
          <rect x="34" y="22" width="12" height="12" rx="2" fill="#7B1828" />
          {/* Kalasam (finial) */}
          <ellipse cx="40" cy="18" rx="5" ry="6" fill="#C9860C" />
          <circle cx="40" cy="11" r="3" fill="#C9860C" />
          {/* Decorative dots on tiers */}
          <circle cx="40" cy="62" r="2" fill="#FDF6EC" />
          <circle cx="40" cy="50" r="2" fill="#FDF6EC" />
          <circle cx="40" cy="38" r="2" fill="#FDF6EC" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-100 mb-2 font-sans">
        {title}
      </h3>
      <p className="text-sm text-brand-600/60 dark:text-brand-300 max-w-sm mb-6 font-sans">
        {message}
      </p>

      {onClear && (
        <button
          onClick={onClear}
          className="text-sm font-semibold text-saffron-600 hover:text-saffron-500 underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2 rounded dark:text-saffron-400 dark:hover:text-saffron-300"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
