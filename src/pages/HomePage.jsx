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

const SAMPLE_EVENTS = [
  { id: 'sample-1', title: 'HackMadurai 2026', category: 'hackathon', domain: ['AI/ML', 'Web Dev'], venue_name: 'Thiagarajar College of Engineering', micro_location: 'Madurai South', event_date: '2026-11-15T09:00:00Z', deadline: '2026-11-10T23:59:00Z', poster_url: null, latitude: 9.8933, longitude: 78.1108 },
  { id: 'sample-2', title: 'StartupSphere Bootcamp', category: 'bootcamp', domain: ['Business', 'Design'], venue_name: 'Madurai Startup Hub', micro_location: 'Anna Nagar', event_date: '2026-12-01T10:00:00Z', deadline: '2026-11-28T23:59:00Z', poster_url: null, latitude: 9.9390, longitude: 78.1322 },
  { id: 'sample-3', title: 'IoT & Hardware Workshop', category: 'workshop', domain: ['Hardware/IoT', 'Data Science'], venue_name: 'MDMA College of Engineering', micro_location: 'KK Nagar', event_date: '2026-11-22T09:30:00Z', deadline: '2026-11-20T23:59:00Z', poster_url: null, latitude: 9.9601, longitude: 78.0881 },
  { id: 'sample-4', title: 'Madurai Tech Meetup — October', category: 'meetup', domain: ['Web Dev', 'Cybersecurity'], venue_name: 'Kumaran Ratnam Library', micro_location: 'Tallakulam', event_date: '2026-10-25T18:00:00Z', deadline: null, poster_url: null, latitude: 9.9312, longitude: 78.1205 },
  { id: 'sample-5', title: 'AI Symposium 2026', category: 'symposium', domain: ['AI/ML', 'Data Science'], venue_name: 'Mepco Schlenk Engineering College', micro_location: 'Pasumalai', event_date: '2026-12-10T09:00:00Z', deadline: '2026-12-05T23:59:00Z', poster_url: null, latitude: 9.9010, longitude: 78.0754 },
  { id: 'sample-6', title: 'Community Builders Madurai', category: 'community', domain: ['Business', 'Design'], venue_name: 'Town Hall Auditorium', micro_location: 'Othakadai', event_date: '2026-11-05T17:00:00Z', deadline: null, poster_url: null, latitude: 9.9489, longitude: 78.1567 },
]

export default function HomePage() {
  const { filters, setFilter, clearFilters } = useFilters()
  const { bookmarkedIds, toggleBookmark }    = useBookmarks()
  const { user }                             = useAuth()
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [sortMode, setSortMode] = useState('soonest')

  // Guard: the non-search filter effect already fetches on mount;
  // skip the debounced search effect on first render to avoid a double fetch.
  const firstSearchRun = useRef(true)
  const debounceTimer  = useRef(null)

  const fetchEvents = useCallback(async (activeFilters) => {
    setLoading(true)
    try {
      const result = await getEvents(activeFilters)
      const data   = result?.data ?? []
      setEvents(data.length > 0 ? data : SAMPLE_EVENTS)
    } catch {
      setEvents(SAMPLE_EVENTS)
    } finally {
      setLoading(false)
    }
  }, [])

  // Immediate fetch when non-search filters change (also runs on mount)
  useEffect(() => {
    fetchEvents(filters)
  }, [filters.category, filters.domain, filters.micro_location, filters.date_from, filters.date_to])

  // Debounced fetch for search — skip the very first render
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

      {/* Hero banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white px-6 py-10 sm:px-12 sm:py-14 mb-8 shadow-lg">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="absolute -left-10 -bottom-20 h-56 w-56 rounded-full bg-indigo-400/20 blur-2xl" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="text-blue-100 text-sm font-medium mb-2">📍 Madurai · students · founders · makers</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-3">
            Find your next event in <span className="text-yellow-300">Madurai</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-6">
            Hackathons, symposiums, bootcamps and meetups — all in one place.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#events" className="bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-50 transition-colors">
              Browse events
            </a>
            {user?.role === 'organizer'
              ? <Link to="/organizer/events/new" className="border border-white/40 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors">+ Post an event</Link>
              : !user && <Link to="/register" className="border border-white/40 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors">Organising? Join as organiser</Link>
            }
          </div>
          {!loading && (
            <div className="flex flex-wrap gap-2 mt-6 text-xs font-medium">
              <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-full">{events.length} upcoming</span>
              {closingSoon > 0 && (
                <span className="bg-orange-400/90 text-white px-3 py-1 rounded-full">⏰ {closingSoon} closing this week</span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Category chips */}
      <div id="events" className="mb-6 scroll-mt-20">
        <CategoryChips value={filters.category} onChange={v => setFilter('category', v)} />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <EventFilters filters={filters} onChange={setFilter} onClear={clearFilters} resultCount={events.length} />
      </div>

      {/* Sort + view toggle */}
      <div className="flex items-center justify-between sm:justify-end mb-4 gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-500">
          Sort
          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>

        {/* View toggle — mobile only; desktop always shows side-by-side */}
        <div className="flex items-center gap-2 lg:hidden">
          <span className="text-sm text-gray-500 mr-1">View:</span>
          <button
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            aria-pressed={viewMode === 'map'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            Map
          </button>
        </div>
      </div>

      {/* Desktop: side-by-side grid + map */}
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

      {/* Mobile: toggle */}
      <div className="lg:hidden">
        {viewMode === 'grid'
          ? <EventGrid
              events={sortedEvents}
              loading={loading}
              bookmarkedIds={bookmarkedIds}
              onBookmark={toggleBookmark}
              onClearFilters={clearFilters}
            />
          : <div className="h-[500px]">
              <EventMap events={events} onMarkerClick={setSelectedEventId} selectedEventId={selectedEventId} />
            </div>
        }
      </div>
    </div>
  )
}
