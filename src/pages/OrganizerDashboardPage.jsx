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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-sm text-gray-500">Create, publish and manage the events you organise.</p>
        </div>
        <Link
          to="/organizer/events/new"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm"
        >
          + Post an event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Published" value={published.length} />
        <Stat label="Drafts"    value={drafts.length} />
        <Stat label="Views"     value={totalViews} />
        <Stat label="Saves"     value={totalSaves} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4" role="tablist" aria-label="Filter events">
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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => { setLoading(true); load() }} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {!error && visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-700 font-medium mb-1">
            {events.length === 0 ? 'No events yet' : 'Nothing in this tab'}
          </p>
          <p className="text-sm text-gray-500 mb-5">
            {events.length === 0
              ? 'Post your first event and reach students across Madurai.'
              : 'Switch tabs to see your other events.'}
          </p>
          {events.length === 0 && (
            <Link to="/organizer/events/new" className="text-sm font-semibold text-blue-600 hover:underline">
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
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <EventBadge category={ev.category} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      ev.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ev.is_published ? 'Live' : 'Draft'}
                    </span>
                    {isDeadlinePassed(ev.deadline) && (
                      <span className="text-xs text-red-500 font-medium">Registration closed</span>
                    )}
                  </div>
                  <h2 className="font-semibold text-gray-900 truncate">{ev.title}</h2>
                  <p className="text-sm text-gray-500 truncate">
                    {formatDate(ev.event_date)} · {ev.venue_name}, {ev.micro_location} ·{' '}
                    {stats.view_count ?? 0} views · {stats.bookmark_count ?? 0} saves
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
                  {ev.is_published && (
                    <Link to={`/events/${ev.id}`} className="text-sm text-gray-600 hover:text-blue-600 px-2 py-1">
                      View
                    </Link>
                  )}
                  <Link
                    to={`/organizer/events/${ev.id}/edit`}
                    className="text-sm text-gray-600 hover:text-blue-600 px-2 py-1"
                  >
                    Edit
                  </Link>
                  <button
                    disabled={busy}
                    onClick={() => handleToggle(ev)}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-400 disabled:opacity-50"
                    aria-label={ev.is_published ? `Unpublish ${ev.title}` : `Publish ${ev.title}`}
                  >
                    {ev.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => handleDelete(ev)}
                    className="text-sm text-red-600 hover:text-red-700 px-2 py-1 disabled:opacity-50"
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

// Supabase returns the joined 1:1 row as an object or a one-element array
function statsOf(ev) {
  const s = ev.event_stats
  return (Array.isArray(s) ? s[0] : s) ?? {}
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}
