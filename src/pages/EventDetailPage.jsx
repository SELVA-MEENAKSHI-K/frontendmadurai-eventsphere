import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import EventBadge from '../components/events/EventBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { getEventById } from '../services/eventService'
import { formatDateTime, isDeadlinePassed, isDeadlineSoon, deadlineCountdown } from '../utils/dateUtils'
import useBookmarks from '../hooks/useBookmarks'
import { downloadICS, googleCalendarUrl } from '../utils/calendarUtils'
import { getSampleEventById } from '../data/sampleEvents'

export default function EventDetailPage() {
  const { id }     = useParams()
  const [event, setEvent]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [registeredDemoIds, setRegisteredDemoIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('eventsphere_demo_registrations') || '[]')
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })
  const { bookmarkedIds, toggleBookmark } = useBookmarks()

  useEffect(() => {
    async function load() {
      setError(null)
      setEvent(null)
      try {
        setLoading(true)
        const result = await getEventById(id)
        const eventData = result?.data ?? result
        const sampleEvent = getSampleEventById(id)
        if (eventData?.id) {
          setEvent(eventData)
        } else if (sampleEvent) {
          setEvent(sampleEvent)
        } else {
          setError('Event not found.')
        }
      } catch (err) {
        const sampleEvent = getSampleEventById(id)
        if (sampleEvent) setEvent(sampleEvent)
        else setError(err.message || 'Could not load this event.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: event?.title, text: `${event?.title} — Madurai EventSphere`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    } catch (err) {
      if (err?.name !== 'AbortError') toast.error('Could not share this event.')
    }
  }

  function handleDemoRegistration() {
    if (registeredDemoIds.includes(id)) return
    const next = [...registeredDemoIds, id]
    try {
      localStorage.setItem('eventsphere_demo_registrations', JSON.stringify(next))
      setRegisteredDemoIds(next)
      toast.success('Demo registration complete! No real registration was sent.')
    } catch {
      toast.error('Could not save this demo registration in your browser.')
    }
  }

  if (loading) return <LoadingSpinner message="Loading event details..." />

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">{error ?? 'Event not found.'}</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Back to Events</Link>
      </div>
    )
  }

  const {
    title, category, domain = [], description, eligibility,
    venue_name, address, micro_location,
    event_date, deadline, registration_url,
    poster_url, organizer, latitude, longitude,
    is_demo,
  } = event

  const deadlinePassed = isDeadlinePassed(deadline)
  const deadlineSoon   = isDeadlineSoon(deadline)
  const countdown      = deadlineCountdown(deadline)
  const isBookmarked   = bookmarkedIds.has(id)

  const mapsUrl = latitude && longitude
    ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
    : null

  const gcalUrl = googleCalendarUrl(event)

  return (
    <>
      <Helmet>
        <title>{title} — Madurai EventSphere</title>
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description ?? `${category} event in ${micro_location}, Madurai`} />
        {poster_url && <meta property="og:image" content={poster_url} />}
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        {/* Deadline urgency banner */}
        {deadlineSoon && !deadlinePassed && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-4 py-3 rounded-xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Registration closes soon — {countdown}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Poster — fade in on load */}
          <div className="relative h-56 sm:h-80 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
            {poster_url ? (
              <>
                {!imgLoaded && <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 animate-pulse" />}
                <img
                  src={poster_url}
                  alt={`${title} poster`}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Share + bookmark */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Share this event"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button
                onClick={() => toggleBookmark(id)}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-colors ${isBookmarked ? 'text-blue-600 fill-blue-600' : 'text-gray-400'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>

            {/* Category badge overlay */}
            <div className="absolute bottom-4 left-4">
              <EventBadge category={category} />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">{title}</h1>
            {is_demo && (
              <p className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4">
                Demo event · Sample information for preview; registration is not available.
              </p>
            )}

            {domain.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {domain.map(tag => (
                  <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <InfoRow icon={<CalendarIcon />} label="Event Date"              value={formatDateTime(event_date)} />
              <InfoRow
                icon={<ClockIcon />}
                label="Registration Deadline"
                value={deadline ? `${formatDateTime(deadline)}${countdown ? ` (${countdown})` : ''}` : 'No deadline set'}
                valueClass={deadlinePassed ? 'text-red-600' : deadlineSoon ? 'text-orange-600' : undefined}
              />
              <InfoRow icon={<PinIcon />}     label="Venue"   value={venue_name} />
              <InfoRow
                icon={<MapIcon />}
                label="Area"
                value={
                  mapsUrl
                    ? <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline underline-offset-2">{micro_location}, Madurai ↗</a>
                    : `${micro_location}, Madurai`
                }
              />
              {address   && <InfoRow icon={<AddressIcon />} label="Address"   value={address}   className="sm:col-span-2" />}
              {organizer && (
                <InfoRow
                  icon={<UserIcon />}
                  label="Organiser"
                  value={organizer.college ? `${organizer.full_name} · ${organizer.college}` : organizer.full_name}
                  className="sm:col-span-2"
                />
              )}
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

            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
              {is_demo && !deadlinePassed ? (
                <div className="flex flex-col items-start gap-2">
                  <button
                    type="button"
                    onClick={handleDemoRegistration}
                    disabled={registeredDemoIds.includes(id)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {registeredDemoIds.includes(id) ? 'Registered (Demo)' : 'Register for this event (Demo)'}
                  </button>
                  <p className="text-xs text-gray-500">Demo registration is saved only in this browser; it is not sent to the organiser.</p>
                </div>
              ) : registration_url && !deadlinePassed ? (
                <a
                  href={registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Register Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <button disabled aria-disabled="true" className="inline-flex items-center gap-2 bg-gray-200 text-gray-500 font-semibold px-6 py-3 rounded-xl cursor-not-allowed">
                  {is_demo && deadlinePassed ? 'Demo registration closed' : deadlinePassed ? 'Registration Closed' : 'Registration unavailable'}
                </button>
              )}

              {gcalUrl && (
                <>
                  <a
                    href={gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-gray-200 hover:border-blue-400 text-gray-700 text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
                  >
                    📅 Google Calendar
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadICS(event)}
                    className="inline-flex items-center gap-2 border border-gray-200 hover:border-blue-400 text-gray-700 text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
                  >
                    ⬇ .ics
                  </button>
                </>
              )}

              {deadline && !deadlinePassed && (
                <span className="text-sm text-gray-400">
                  {deadlineSoon
                    ? <span className="text-orange-600 font-medium">⏰ {countdown}</span>
                    : `Closes ${formatDateTime(deadline)}`
                  }
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── InfoRow ───────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, valueClass, className }) {
  return (
    <div className={`flex items-start gap-3 ${className ?? ''}`}>
      <span className="mt-0.5 flex-shrink-0 text-gray-400">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
        <span className={`text-sm font-medium text-gray-800 break-words ${valueClass ?? ''}`}>{value}</span>
      </div>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const ic = 'h-4 w-4'
function CalendarIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
function ClockIcon()    { return <svg xmlns="http://www.w3.org/2000/svg" className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
function PinIcon()      { return <svg xmlns="http://www.w3.org/2000/svg" className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function MapIcon()      { return <svg xmlns="http://www.w3.org/2000/svg" className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> }
function AddressIcon()  { return <svg xmlns="http://www.w3.org/2000/svg" className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> }
function UserIcon()     { return <svg xmlns="http://www.w3.org/2000/svg" className={ic} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
