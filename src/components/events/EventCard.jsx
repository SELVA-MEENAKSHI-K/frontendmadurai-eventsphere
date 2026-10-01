import { Link } from 'react-router-dom'
import EventBadge from './EventBadge'
import { formatDate, isDeadlinePassed, isDeadlineSoon, deadlineCountdown } from '../../utils/dateUtils'

export default function EventCard({ event, isBookmarked = false, onBookmark }) {
  const { id, title, category, domain = [], venue_name, micro_location, event_date, deadline, poster_url } = event
  const deadlinePassed = isDeadlinePassed(deadline)
  const deadlineSoon   = isDeadlineSoon(deadline)
  const countdown      = deadlineCountdown(deadline)
  const visibleDomains = domain.slice(0, 3)

  function handleBookmark(e) {
    e.preventDefault()
    e.stopPropagation()
    if (onBookmark) onBookmark(id)
  }

  return (
    <Link to={`/events/${id}`} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label={`View details for ${title}`}>
      <div className="relative h-44 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {poster_url
          ? <img src={poster_url} alt={`${title} poster`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }
        <div className="absolute top-3 left-3"><EventBadge category={category} /></div>
        <button onClick={handleBookmark} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm" aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors ${isBookmarked ? 'text-blue-600 fill-blue-600' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" fill={isBookmarked ? 'currentColor' : 'none'}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        {deadlineSoon && !deadlinePassed && (
          <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">⏰ {countdown}</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span>{formatDate(event_date)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="truncate">{venue_name} &middot; {micro_location}</span>
        </div>
        {visibleDomains.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {visibleDomains.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>)}
            {domain.length > 3 && <span className="text-xs text-gray-400 px-1 py-0.5">+{domain.length - 3}</span>}
          </div>
        )}
        {deadlinePassed && <p className="text-xs text-red-500 font-medium mt-1">Registration closed</p>}
      </div>
    </Link>
  )
}
