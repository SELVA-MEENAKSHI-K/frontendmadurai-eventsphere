import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import EventBadge from '../components/events/EventBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { getEventById } from '../services/eventService'
import { formatDateTime, isDeadlinePassed, deadlineCountdown } from '../utils/dateUtils'
import useBookmarks from '../hooks/useBookmarks'

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const { bookmarkedIds, toggleBookmark } = useBookmarks()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const result = await getEventById(id)
        setEvent(result?.data ?? result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <LoadingSpinner message="Loading event details..." />
  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">{error ?? 'Event not found.'}</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Back to Events</Link>
      </div>
    )
  }

  const { title, category, domain = [], description, eligibility, venue_name, address, micro_location, event_date, deadline, registration_url, poster_url, organizer } = event
  const deadlinePassed = isDeadlinePassed(deadline)
  const countdown      = deadlineCountdown(deadline)

  return (
    <>
      <Helmet>
        <title>{title} — Madurai EventSphere</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description ?? `${category} event in ${micro_location}, Madurai`} />
        {poster_url && <meta property="og:image" content={poster_url} />}
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Events
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative h-56 sm:h-72 bg-gradient-to-br from-blue-50 to-indigo-100">
            {poster_url
              ? <img src={poster_url} alt={`${title} poster`} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
            }
            <button onClick={() => toggleBookmark(id)} className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow" aria-label={bookmarkedIds.has(id) ? 'Remove bookmark' : 'Bookmark this event'}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${bookmarkedIds.has(id) ? 'text-blue-600 fill-blue-600' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" fill={bookmarkedIds.has(id) ? 'currentColor' : 'none'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start gap-3 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1 leading-tight">{title}</h1>
              <EventBadge category={category} />
            </div>
            {domain.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {domain.map(tag => <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{tag}</span>)}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <InfoRow label="Event Date" value={formatDateTime(event_date)} />
              <InfoRow label="Registration Deadline" value={deadline ? `${formatDateTime(deadline)}${countdown ? ` (${countdown})` : ''}` : 'No deadline set'} valueClass={deadlinePassed ? 'text-red-600' : undefined} />
              <InfoRow label="Venue" value={venue_name} />
              <InfoRow label="Area" value={`${micro_location}, Madurai`} />
              {address && <InfoRow label="Address" value={address} className="sm:col-span-2" />}
              {organizer && <InfoRow label="Organiser" value={organizer.college ? `${organizer.full_name} · ${organizer.college}` : organizer.full_name} className="sm:col-span-2" />}
            </div>
            {description && (
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-800 mb-2">About this event</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{description}</p>
              </div>
            )}
            {eligibility && (
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-800 mb-2">Eligibility</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{eligibility}</p>
              </div>
            )}
            <div className="pt-4 border-t border-gray-100">
              {registration_url && !deadlinePassed
                ? <a href={registration_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm">
                    Register Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                : <button disabled className="inline-flex items-center gap-2 bg-gray-200 text-gray-500 font-semibold px-6 py-3 rounded-xl cursor-not-allowed" aria-disabled="true">Registration Closed</button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function InfoRow({ label, value, valueClass, className }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className ?? ''}`}>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-medium text-gray-800 ${valueClass ?? ''}`}>{value}</span>
    </div>
  )
}
