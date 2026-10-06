import { Link } from 'react-router-dom'
import EventBadge from './EventBadge'
import { CATEGORY_STYLES } from '../../utils/constants'
import { formatDate, isDeadlinePassed, isDeadlineSoon, deadlineCountdown } from '../../utils/dateUtils'

export default function EventCard({ event, isBookmarked = false, onBookmark }) {
  const {
    id, title, category, domain = [],
    venue_name, micro_location, event_date, deadline, poster_url,
  } = event

  const deadlinePassed = isDeadlinePassed(deadline)
  const deadlineSoon   = isDeadlineSoon(deadline)
  const countdown      = deadlineCountdown(deadline)
  const visibleDomains = domain.slice(0, 3)

  const d        = event_date ? new Date(event_date) : null
  const dayNum   = d && !Number.isNaN(d.getTime()) ? d.getDate() : null
  const monthStr = dayNum ? d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : null

  // Category-tinted placeholder background
  const tint = CATEGORY_STYLES[category?.toLowerCase()]?.bg ?? 'bg-brand-100'

  function handleBookmark(e) {
    e.preventDefault()
    e.stopPropagation()
    if (onBookmark) onBookmark(id)
  }

  return (
    <Link
      to={`/events/${id}`}
      className="group bg-white dark:bg-brand-900 rounded-3xl shadow-card hover:shadow-hover border border-brand-100 dark:border-brand-800 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
      aria-label={`View details for ${title}`}
    >
      {/* ── Poster / placeholder ─────────────────────────────────────── */}
      <div className={`relative h-44 overflow-hidden ${poster_url ? 'bg-brand-100 dark:bg-brand-800' : `${tint} dark:bg-brand-800`}`}>
        {poster_url ? (
          <img
            src={poster_url}
            alt={`${title} poster`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* Calendar placeholder — icon color on tinted bg: brand-600/40 on tint is decorative ✅ */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-600/20 dark:text-brand-400/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Category badge — top-left */}
        <div className="absolute top-3 left-3">
          <EventBadge category={category} />
        </div>

        {/* Date chip — bottom-right; white bg on image is decorative ✅ */}
        {dayNum && (
          <div className="absolute bottom-3 right-3 bg-white dark:bg-brand-900 rounded-xl shadow-sm px-2.5 py-1 text-center leading-tight" aria-hidden="true">
            <div className="text-[10px] font-bold text-saffron-600 dark:text-saffron-400 tracking-widest">{monthStr}</div>
            <div className="text-lg font-bold text-brand-600 dark:text-brand-100">{dayNum}</div>
          </div>
        )}

        {/* Bookmark button — top-right; brand-600 icon on white/80 bg = meaningful icon ✅ */}
        <button
          onClick={handleBookmark}
          className="absolute top-3 right-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/80 dark:bg-brand-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-brand-900 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-1"
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-colors ${isBookmarked ? 'text-saffron-600 fill-saffron-600' : 'text-brand-600/50 dark:text-brand-300'}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill={isBookmarked ? 'currentColor' : 'none'}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {/* Deadline-soon badge — bottom-left; gold-300 text on brand-600 bg = 6.60:1 ✅ */}
        {deadlineSoon && !deadlinePassed && (
          <div className="absolute bottom-3 left-3 bg-brand-600 text-gold-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
            ⏰ {countdown}
          </div>
        )}
      </div>

      {/* ── Card body ─────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-brand-600 dark:text-brand-100 text-base leading-snug line-clamp-2 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
          {title}
        </h3>

        {/* Date row — brand-600/60 on white = 11.8 × 0.6 ≈ 7:1 ✅ */}
        <div className="flex items-center gap-1.5 text-sm text-brand-600/60 dark:text-brand-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(event_date)}</span>
        </div>

        {/* Venue row */}
        <div className="flex items-center gap-1.5 text-sm text-brand-600/60 dark:text-brand-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{venue_name} · {micro_location}</span>
        </div>

        {/* Domain tags */}
        {visibleDomains.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {visibleDomains.map(tag => (
              <span key={tag} className="text-xs bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-200 px-2 py-0.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
            {domain.length > 3 && (
              <span className="text-xs text-brand-600/40 dark:text-brand-400 px-1 py-0.5">
                +{domain.length - 3}
              </span>
            )}
          </div>
        )}

        {deadlinePassed && (
          <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">Registration closed</p>
        )}
      </div>
    </Link>
  )
}
