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
import { registerForDemoEvent, getRegistrationForEvent, qrImageUrl } from '../utils/demoCheckin'

export default function EventDetailPage() {
  const { id }     = useParams()
  const [event, setEvent]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [demoRegistration, setDemoRegistration] = useState(() =>
    getRegistrationForEvent(id ?? '')
  )
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
    if (demoRegistration) return
    const reg = registerForDemoEvent(id)
    setDemoRegistration(reg)
    toast.success('Demo registration complete! Scan the QR code at check-in.')
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

        {/* Deadline urgency banner — gold-300 text on brand-600 bg = 6.60:1 ✅ */}
        {deadlineSoon && !deadlinePassed && (
          <div className="flex items-center gap-2 bg-brand-600 text-gold-300 text-sm font-semibold px-4 py-3 rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Registration closes soon — {countdown}
          </div>
        )}

        <div className="bg-white dark:bg-brand-900 rounded-4xl shadow-card border border-brand-100 dark:border-brand-800 overflow-hidden">

          {/* ── Poster ─────────────────────────────────────────────────────── */}
          <div className="relative h-56 sm:h-80 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-800 dark:to-brand-700 overflow-hidden">
            {poster_url ? (
              <>
                {!imgLoaded && <div className="absolute inset-0 bg-brand-100 dark:bg-brand-800 animate-pulse" />}
                <img
                  src={poster_url}
                  alt={`${title} poster`}
                  onLoad={() => setImgLoaded(true)}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-brand-600/20 dark:text-brand-400/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Share + bookmark — brand-600 icons on white/80 = 11.8:1 ✅ */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleShare}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/80 dark:bg-brand-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-brand-900 shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-1"
                aria-label="Share this event"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-600 dark:text-brand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button
                onClick={() => toggleBookmark(id)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/80 dark:bg-brand-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-brand-900 shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-1"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-colors ${isBookmarked ? 'text-saffron-600 fill-saffron-600' : 'text-brand-600/50 dark:text-brand-300'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>

            <div className="absolute bottom-4 left-4">
              <EventBadge category={category} />
            </div>
          </div>

          {/* ── Content ────────────────────────────────────────────────────── */}
          <div className="p-6 sm:p-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-600 dark:text-brand-50 leading-tight mb-3">
              {title}
            </h1>

            {is_demo && (
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-100/50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-xl px-3 py-2 mb-4">
                Demo event · Sample information for preview.
              </p>
            )}

            {domain.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {domain.map(tag => (
                  <span key={tag} className="text-xs bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-200 px-2.5 py-1 rounded-full font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-brand-50 dark:bg-brand-800/50 rounded-2xl">
              <InfoRow icon={<CalendarIcon />} label="Event Date" value={formatDateTime(event_date)} />
              <InfoRow
                icon={<ClockIcon />}
                label="Registration Deadline"
                value={deadline ? `${formatDateTime(deadline)}${countdown ? ` (${countdown})` : ''}` : 'No deadline set'}
                valueClass={deadlinePassed ? 'text-red-600 dark:text-red-400' : deadlineSoon ? 'text-gold-500 dark:text-gold-300' : undefined}
              />
              <InfoRow icon={<PinIcon />} label="Venue" value={venue_name} />
              <InfoRow
                icon={<MapIcon />}
                label="Area"
                value={
                  mapsUrl
                    ? <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-saffron-600 dark:text-saffron-400 hover:underline underline-offset-2">{micro_location}, Madurai ↗</a>
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
                <h2 className="text-base font-semibold text-brand-600 dark:text-brand-100 mb-2">About this event</h2>
                <p className="text-brand-600/70 dark:text-brand-300 text-sm leading-relaxed whitespace-pre-line">{description}</p>
              </div>
            )}

            {eligibility && (
              <div className="mb-6">
                <h2 className="text-base font-semibold text-brand-600 dark:text-brand-100 mb-2">Eligibility</h2>
                <p className="text-brand-600/70 dark:text-brand-300 text-sm leading-relaxed">{eligibility}</p>
              </div>
            )}

            {/* CTA row */}
            <div className="pt-5 border-t border-brand-100 dark:border-brand-700 flex flex-wrap items-center gap-3">
              {is_demo && !deadlinePassed ? (
                <div className="flex flex-col items-start gap-2">
                  {demoRegistration ? (
                    <div className="bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-2xl p-4 flex flex-col items-center gap-3 w-full sm:w-auto">
                      <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Demo Registration QR</p>
                      <img
                        src={qrImageUrl(demoRegistration.token)}
                        alt={`QR code for token ${demoRegistration.token}`}
                        width={180}
                        height={180}
                        className="rounded-xl border border-teal-200 dark:border-teal-500/30"
                      />
                      <p className="text-[11px] font-mono text-teal-700 dark:text-teal-300 bg-white dark:bg-brand-900 border border-teal-200 dark:border-teal-500/20 rounded-lg px-3 py-1.5 select-all tracking-widest">
                        {demoRegistration.token}
                      </p>
                      <p className="text-xs text-brand-600/50 dark:text-brand-300 text-center max-w-xs">
                        Show this QR or type the code at the check-in desk. Demo only.
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleDemoRegistration}
                        className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
                      >
                        Register for this event (Demo)
                      </button>
                      <p className="text-xs text-brand-600/50 dark:text-brand-400">
                        Demo registration is saved only in this browser; not sent to the organiser.
                      </p>
                    </>
                  )}
                </div>
              ) : registration_url && !deadlinePassed ? (
                <a
                  href={registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
                >
                  Register Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <button disabled aria-disabled="true" className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-800 text-brand-600/50 dark:text-brand-400 font-semibold px-6 py-3 rounded-2xl cursor-not-allowed">
                  {is_demo && deadlinePassed ? 'Demo registration closed' : deadlinePassed ? 'Registration Closed' : 'Registration unavailable'}
                </button>
              )}

              {gcalUrl && (
                <>
                  <a href={gcalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-brand-200 dark:border-brand-700 hover:border-saffron-600 dark:hover:border-saffron-400 text-brand-600 dark:text-brand-200 text-sm font-semibold px-4 py-3 rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2">
                    📅 Google Calendar
                  </a>
                  <button type="button" onClick={() => downloadICS(event)} className="inline-flex items-center gap-2 border border-brand-200 dark:border-brand-700 hover:border-saffron-600 dark:hover:border-saffron-400 text-brand-600 dark:text-brand-200 text-sm font-semibold px-4 py-3 rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2">
                    ⬇ .ics
                  </button>
                </>
              )}

              {deadline && !deadlinePassed && (
                <span className="text-sm text-brand-600/50 dark:text-brand-400">
                  {deadlineSoon
                    ? <span className="text-gold-500 dark:text-gold-300 font-semibold">⏰ {countdown}</span>
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
      {/* Icon color: brand-600/40 on brand-50 bg is decorative ✅ */}
      <span className="mt-0.5 flex-shrink-0 text-brand-600/40 dark:text-brand-400">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-semibold text-brand-600/50 dark:text-brand-400 uppercase tracking-wide">{label}</span>
        <span className={`text-sm font-medium text-brand-600 dark:text-brand-100 break-words ${valueClass ?? ''}`}>{value}</span>
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
