import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">

      {/* Decorative 404 with brand colours */}
      <div className="relative mb-6" aria-hidden="true">
        <span className="font-display text-[120px] sm:text-[160px] font-bold leading-none text-brand-100 dark:text-brand-800 select-none">
          404
        </span>
        {/* Gopuram icon overlay — decorative, aria-hidden */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="72" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 dark:opacity-20">
            <rect x="8"  y="68" width="64" height="8"  rx="2" fill="#7B1828" />
            <rect x="16" y="56" width="48" height="14" rx="2" fill="#7B1828" />
            <rect x="22" y="44" width="36" height="14" rx="2" fill="#7B1828" />
            <rect x="28" y="32" width="24" height="14" rx="2" fill="#7B1828" />
            <rect x="34" y="22" width="12" height="12" rx="2" fill="#7B1828" />
            <ellipse cx="40" cy="18" rx="5" ry="6" fill="#C9860C" />
            <circle cx="40" cy="11" r="3" fill="#C9860C" />
          </svg>
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold text-brand-600 dark:text-brand-100 mb-2">Page not found</h1>
      <p className="text-sm text-brand-600/60 dark:text-brand-300 max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* white on saffron-600 = 5.12:1 ✅ */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-500 text-white font-semibold px-6 py-3 rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Back to Home
      </Link>
    </div>
  )
}
