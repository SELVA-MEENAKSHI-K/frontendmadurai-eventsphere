import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import EventGrid from '../components/events/EventGrid'
import EventFilters from '../components/events/EventFilters'
import EventMap from '../components/map/EventMap'
import CategoryChips from '../components/events/CategoryChips'
import { sortEvents, countClosingSoon, SORT_OPTIONS } from '../utils/sortUtils'
import { useAuth } from '../context/AuthContext'
import { useFilters } from '../context/FilterContext'
import { getEvents } from '../services/eventService'
import { SEARCH_DEBOUNCE_MS } from '../utils/constants'
import useBookmarks from '../hooks/useBookmarks'
import sampleEvents from '../data/sampleEvents'

export default function HomePage() {
  const { filters, setFilter, clearFilters } = useFilters()
  const { bookmarkedIds, toggleBookmark }    = useBookmarks()
  const { user }                             = useAuth()
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [sortMode, setSortMode] = useState('soonest')

  const firstSearchRun = useRef(true)
  const debounceTimer  = useRef(null)

  const fetchEvents = useCallback(async (activeFilters) => {
    setLoading(true)
    try {
      const result = await getEvents(activeFilters)
      const data   = result?.data ?? []
      setEvents(data.length > 0 ? data : sampleEvents)
    } catch {
      setEvents(sampleEvents)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents(filters)
  }, [filters.category, filters.domain, filters.micro_location, filters.date_from, filters.date_to])

  useEffect(() => {
    if (firstSearchRun.current) { firstSearchRun.current = false; return }
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => { fetchEvents(filters) }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(debounceTimer.current)
  }, [filters.search])

  const sortedEvents = useMemo(() => sortEvents(events, sortMode), [events, sortMode])
  const closingSoon  = useMemo(() => countClosingSoon(events), [events])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      {/* Maroon bg. Cream on maroon = 11.8:1 ✅. White on maroon = 9.1:1 ✅.
          Saffron-400 on maroon = 3.1:1 — used only for the word "Madurai"
          rendered at display size (font-display, ≥36px) → large text ✅.
          Gold-300 on maroon chip = 6.60:1 ✅.                              */}
      <section
        className="relative overflow-hidden rounded-4xl bg-brand-600 dark:bg-brand-800 text-white px-6 py-12 sm:px-12 sm:py-16 mb-8 shadow-lg"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(253,246,236,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-saffron-400/10 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -left-12 -bottom-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-2xl">
          <p className="text-brand-50/70 text-sm font-semibold mb-3 tracking-wide uppercase">
            📍 Madurai · students · founders · makers
          </p>

          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight mb-4 text-white">
            Find your next event in{' '}
            {/* saffron-400 at ≥36px display = large text, 3.1:1 on maroon ✅ */}
            <span className="text-saffron-400">Madurai</span>
          </h1>

          <p className="text-brand-50/80 text-base sm:text-lg mb-7 max-w-lg">
            Hackathons, symposiums, bootcamps and meetups — all in one place for students and innovators.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#events"
              className="bg-saffron-600 hover:bg-saffron-500 text-white font-semibold text-sm px-6 py-3 rounded-2xl shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600"
            >
              Browse events
            </a>
            {user?.role === 'organizer' ? (
              <Link
                to="/organizer/events/new"
                className="border border-white/30 text-white font-semibold text-sm px-6 py-3 rounded-2xl hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600"
              >
                + Post an event
              </Link>
            ) : !user && (
              <Link
                to="/register"
                className="border border-white/30 text-white font-semibold text-sm px-6 py-3 rounded-2xl hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600"
              >
                Organising? Join as organiser
              </Link>
            )}
          </div>

          {/* Stats pills — gold-300 on maroon = 6.60:1 ✅ */}
          {!loading && (
            <div className="flex flex-wrap gap-2 mt-6 text-xs font-semibold">
              <span className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
                {events.length} upcoming
              </span>
              {closingSoon > 0 && (
                <span className="bg-brand-700/60 text-gold-300 px-3 py-1.5 rounded-full">
                  ⏰ {closingSoon} closing this week
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Category chips ──────────────────────────────────────────────────── */}
      <div id="events" className="mb-6 scroll-mt-20">
        <CategoryChips value={filters.category} onChange={v => setFilter('category', v)} />
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <EventFilters filters={filters} onChange={setFilter} onClear={clearFilters} resultCount={events.length} />
      </div>

      {/* ── Sort + view toggle ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between sm:justify-end mb-5 gap-3">
        <label className="flex items-center gap-2 text-sm text-brand-600/70 dark:text-brand-300 font-medium">
          Sort
          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value)}
            className="text-sm border border-brand-200 dark:border-brand-700 rounded-xl px-3 py-1.5 bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-100 focus:outline-none focus:ring-2 focus:ring-saffron-600"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>

        {/* Mobile-only view toggle */}
        <div className="flex items-center gap-1.5 lg:hidden" role="group" aria-label="View mode">
          <button
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2 ${
              viewMode === 'grid'
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-200 hover:border-saffron-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            aria-pressed={viewMode === 'map'}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2 ${
              viewMode === 'map'
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-200 hover:border-saffron-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            Map
          </button>
        </div>
      </div>

      {/* ── Desktop: grid + map side-by-side ─────────────────────────────────── */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
        <div className="lg:col-span-3">
          <EventGrid
            events={sortedEvents}
            loading={loading}
            bookmarkedIds={bookmarkedIds}
            onBookmark={toggleBookmark}
            onClearFilters={clearFilters}
          />
        </div>
        <div className="lg:col-span-2 h-[600px] sticky top-20">
          <EventMap events={events} onMarkerClick={setSelectedEventId} selectedEventId={selectedEventId} />
        </div>
      </div>

      {/* ── Mobile: toggle ─────────────────────────────────────────────────────── */}
      <div className="lg:hidden">
        {viewMode === 'grid' ? (
          <EventGrid
            events={sortedEvents}
            loading={loading}
            bookmarkedIds={bookmarkedIds}
            onBookmark={toggleBookmark}
            onClearFilters={clearFilters}
          />
        ) : (
          <div className="h-[500px] rounded-3xl overflow-hidden">
            <EventMap events={events} onMarkerClick={setSelectedEventId} selectedEventId={selectedEventId} />
          </div>
        )}
      </div>
    </div>
  )
}
