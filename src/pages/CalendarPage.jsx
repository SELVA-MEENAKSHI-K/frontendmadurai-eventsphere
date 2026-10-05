import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getEvents } from '../services/eventService'
import sampleEvents from '../data/sampleEvents'
import EventBadge from '../components/events/EventBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatDate } from '../utils/dateUtils'
import { CATEGORY_STYLES } from '../utils/constants'

// ── Calendar grid helpers ──────────────────────────────────────────────────────

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Returns the ISO date string (YYYY-MM-DD) for a local Date */
function toLocalDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Returns the YYYY-MM-DD string for an event's event_date in local time */
function eventDateKey(eventDateStr) {
  if (!eventDateStr) return null
  return toLocalDateStr(new Date(eventDateStr))
}

/** Build the array of day-cells for a given year/month (0-indexed month).
 *  Includes trailing/leading nulls so the grid starts on Sunday. */
function buildGridDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay() // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today    = useMemo(() => new Date(), [])
  const [year, setYear]       = useState(today.getFullYear())
  const [month, setMonth]     = useState(today.getMonth())
  const [selected, setSelected] = useState(toLocalDateStr(today))
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Fetch all events once; fall back to sample data on error
  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await getEvents()
        const data   = result?.data ?? []
        setEvents(data.length > 0 ? data : sampleEvents)
      } catch {
        setEvents(sampleEvents)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Map event_date → array of events for O(1) lookup
  const eventsByDate = useMemo(() => {
    const map = {}
    for (const ev of events) {
      const key = eventDateKey(ev.event_date)
      if (!key) continue
      if (!map[key]) map[key] = []
      map[key].push(ev)
    }
    return map
  }, [events])

  const gridDays   = useMemo(() => buildGridDays(year, month), [year, month])
  const todayStr   = toLocalDateStr(today)
  const selectedEvents = eventsByDate[selected] ?? []

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function goToToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
    setSelected(todayStr)
  }

  function selectDay(day) {
    if (!day) return
    const y = String(year)
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    setSelected(`${y}-${m}-${d}`)
  }

  return (
    <>
      <Helmet>
        <title>Event Calendar — Madurai EventSphere</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Browse upcoming events in Madurai by date.</p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading events…" />
        ) : error ? (
          <p role="alert" className="text-sm text-red-500 text-center py-12">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Month grid ──────────────────────────────────────────────────── */}
            <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6" aria-label="Event calendar">

              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Previous month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-gray-900">
                    {MONTH_NAMES[month]} {year}
                  </h2>
                  {(year !== today.getFullYear() || month !== today.getMonth()) && (
                    <button
                      onClick={goToToday}
                      className="text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors"
                    >
                      Today
                    </button>
                  )}
                </div>

                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Next month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-1" role="row">
                {WEEKDAYS.map(d => (
                  <div
                    key={d}
                    className="py-1 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide"
                    aria-label={d}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100" role="grid" aria-label={`${MONTH_NAMES[month]} ${year}`}>
                {gridDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="bg-gray-50 h-14 sm:h-16" aria-hidden="true" />
                  }
                  const dateStr    = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const isToday    = dateStr === todayStr
                  const isSelected = dateStr === selected
                  const dayEvents  = eventsByDate[dateStr] ?? []
                  const hasEvents  = dayEvents.length > 0

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => selectDay(day)}
                      aria-label={`${day} ${MONTH_NAMES[month]} ${year}${hasEvents ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
                      aria-pressed={isSelected}
                      className={`relative flex flex-col items-center justify-start pt-1 h-14 sm:h-16 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : isToday
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-sm font-medium leading-none mb-1 ${isToday && !isSelected ? 'font-bold' : ''}`}>
                        {day}
                      </span>
                      {/* Event dot indicators — max 3 */}
                      {hasEvents && (
                        <div className="flex gap-0.5 flex-wrap justify-center px-1">
                          {dayEvents.slice(0, 3).map(ev => {
                            const dot = CATEGORY_STYLES[ev.category?.toLowerCase()]?.dot ?? 'bg-blue-400'
                            return (
                              <span
                                key={ev.id}
                                className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : dot}`}
                                aria-hidden="true"
                              />
                            )
                          })}
                          {dayEvents.length > 3 && (
                            <span className={`text-[9px] leading-none font-bold ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                              +{dayEvents.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-3">
                {Object.entries(CATEGORY_STYLES).map(([cat, styles]) => (
                  <span key={cat} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${styles.dot}`} aria-hidden="true" />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                ))}
              </div>
            </section>

            {/* ── Day detail panel ─────────────────────────────────────────────── */}
            <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6" aria-label="Events on selected date">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {formatDate(selected + 'T00:00:00')}
              </h2>

              {selectedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-400">No events on this day.</p>
                  <p className="text-xs text-gray-300 mt-1">Select a highlighted date to see events.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {selectedEvents.map(ev => (
                    <li key={ev.id}>
                      <Link
                        to={`/events/${ev.id}`}
                        className="group flex flex-col gap-1 rounded-xl border border-gray-100 p-3 hover:border-blue-200 hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">
                            {ev.title}
                          </span>
                          <EventBadge category={ev.category} />
                        </div>
                        <span className="text-xs text-gray-500 truncate">
                          {ev.venue_name} · {ev.micro_location}
                        </span>
                        {ev.event_date && (
                          <span className="text-xs text-gray-400">
                            {new Date(ev.event_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </aside>

          </div>
        )}
      </div>
    </>
  )
}
