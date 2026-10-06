import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import EventBadge from '../components/events/EventBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { getMyEvents, togglePublish } from '../services/organizerService'
import { deleteEvent } from '../services/eventService'
import { formatDate, isDeadlinePassed } from '../utils/dateUtils'

export default function OrganizerDashboardPage() {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [busyId, setBusyId]   = useState(null)
  const [tab, setTab]         = useState('all')

  const load = useCallback(async () => {
    try {
      setError(null)
      const result = await getMyEvents()
      setEvents(result.data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleToggle(ev) {
    setBusyId(ev.id)
    try {
      const result = await togglePublish(ev.id)
      setEvents(prev => prev.map(e =>
        e.id === ev.id ? { ...e, is_published: result.data.is_published } : e
      ))
      toast.success(result.data.is_published ? 'Event is now live' : 'Moved back to drafts')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(ev) {
    if (!window.confirm(`Delete "${ev.title}"? This can't be undone.`)) return
    setBusyId(ev.id)
    try {
      await deleteEvent(ev.id)
      setEvents(prev => prev.filter(e => e.id !== ev.id))
      toast.success('Event deleted')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <LoadingSpinner message="Loading your events..." />

  const published  = events.filter(e => e.is_published)
  const drafts     = events.filter(e => !e.is_published)
  const totalViews = events.reduce((n, e) => n + (statsOf(e).view_count ?? 0), 0)
  const totalSaves = events.reduce((n, e) => n + (statsOf(e).bookmark_count ?? 0), 0)
  const visible    = tab === 'published' ? published : tab === 'drafts' ? drafts : events

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet><title>My Events — Madurai EventSphere</title></Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-600 dark:text-brand-50">My Events</h1>
          <p className="text-sm text-brand-600/60 dark:text-brand-300 mt-0.5">Create, publish and manage the events you organise.</p>
        </div>
        {/* white on saffron-600 = 5.12:1 ✅ */}
        <Link
          to="/organizer/events/new"
          className="inline-flex items-center justify-center gap-2 bg-saffron-600 hover:bg-saffron-500 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
        >
          + Post an event
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Published" value={published.length} accent />
        <Stat label="Drafts"    value={drafts.length} />
        <Stat label="Views"     value={totalViews} />
        <Stat label="Saves"     value={totalSaves} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5" role="tablist" aria-label="Filter events">
        {[
          ['all',       `All (${events.length})`],
          ['published', `Published (${published.length})`],
          ['drafts',    `Drafts (${drafts.length})`],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2 ${
              tab === key
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-200 hover:border-saffron-600 dark:hover:border-saffron-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-2xl p-4 mb-4 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => { setLoading(true); load() }} className="font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 rounded">
            Retry
          </button>
        </div>
      )}

      {!error && visible.length === 0 ? (
        <div className="bg-white dark:bg-brand-900 rounded-3xl border border-dashed border-brand-200 dark:border-brand-700 py-16 text-center">
          <p className="font-semibold text-brand-600 dark:text-brand-100 mb-1">
            {events.length === 0 ? 'No events yet' : 'Nothing in this tab'}
          </p>
          <p className="text-sm text-brand-600/60 dark:text-brand-300 mb-5">
            {events.length === 0
              ? 'Post your first event and reach students across Madurai.'
              : 'Switch tabs to see your other events.'}
          </p>
          {events.length === 0 && (
            <Link to="/organizer/events/new" className="text-sm font-semibold text-saffron-600 dark:text-saffron-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 rounded">
              Post an event →
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map(ev => {
            const stats = statsOf(ev)
            const busy  = busyId === ev.id
            return (
              <li
                key={ev.id}
                className="bg-white dark:bg-brand-900 rounded-3xl border border-brand-100 dark:border-brand-800 shadow-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <EventBadge category={ev.category} />
                    {/* Live status pill — white on teal-500 = 4.93:1 ✅ */}
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      ev.is_published
                        ? 'bg-teal-500 text-white'
                        : 'bg-brand-100 dark:bg-brand-800 text-brand-600/70 dark:text-brand-300'
                    }`}>
                      {ev.is_published ? 'Live' : 'Draft'}
                    </span>
                    {isDeadlinePassed(ev.deadline) && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-semibold">Registration closed</span>
                    )}
                  </div>
                  <h2 className="font-semibold text-brand-600 dark:text-brand-100 truncate">{ev.title}</h2>
                  <p className="text-sm text-brand-600/60 dark:text-brand-300 truncate">
                    {formatDate(ev.event_date)} · {ev.venue_name}, {ev.micro_location} ·{' '}
                    {stats.view_count ?? 0} views · {stats.bookmark_count ?? 0} saves
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
                  {ev.is_published && (
                    <Link to={`/events/${ev.id}`} className="text-sm font-medium text-brand-600/70 dark:text-brand-300 hover:text-saffron-600 dark:hover:text-saffron-400 px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 rounded transition-colors">
                      View
                    </Link>
                  )}
                  <Link
                    to={`/organizer/events/${ev.id}/edit`}
                    className="text-sm font-medium text-brand-600/70 dark:text-brand-300 hover:text-saffron-600 dark:hover:text-saffron-400 px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 rounded transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    disabled={busy}
                    onClick={() => handleToggle(ev)}
                    className="text-sm font-semibold px-3 py-1.5 rounded-xl border border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-200 hover:border-saffron-600 dark:hover:border-saffron-400 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
                    aria-label={ev.is_published ? `Unpublish ${ev.title}` : `Publish ${ev.title}`}
                  >
                    {ev.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => handleDelete(ev)}
                    className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-2 py-1 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded transition-colors"
                    aria-label={`Delete ${ev.title}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function statsOf(ev) {
  const s = ev.event_stats
  return (Array.isArray(s) ? s[0] : s) ?? {}
}

function Stat({ label, value, accent }) {
  return (
    <div className={`rounded-2xl border shadow-card px-4 py-3 ${accent ? 'bg-saffron-600 border-saffron-600 text-white' : 'bg-white dark:bg-brand-900 border-brand-100 dark:border-brand-800'}`}>
      {/* white on saffron-600 = 5.12:1 ✅; brand-600 on white = 11.8:1 ✅ */}
      <p className={`text-2xl font-bold ${accent ? 'text-white' : 'text-brand-600 dark:text-brand-50'}`}>{value}</p>
      <p className={`text-xs font-medium ${accent ? 'text-white/80' : 'text-brand-600/60 dark:text-brand-300'}`}>{label}</p>
    </div>
  )
}
