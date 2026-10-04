import { useState, useEffect, useCallback, useRef } from 'react'
import EventGrid from '../components/events/EventGrid'
import EventFilters from '../components/events/EventFilters'
import EventMap from '../components/map/EventMap'
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
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const debounceTimer = useRef(null)

  const fetchEvents = useCallback(async (activeFilters) => {
    setLoading(true)
    try {
      const result = await getEvents(activeFilters)
      const data = result?.data ?? []
      setEvents(data.length > 0 ? data : SAMPLE_EVENTS)
    } catch {
      setEvents(SAMPLE_EVENTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents(filters)
  }, [filters.category, filters.domain, filters.micro_location, filters.date_from, filters.date_to])

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => { fetchEvents(filters) }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(debounceTimer.current)
  }, [filters.search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Discover Events in <span className="text-blue-600">Madurai</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Hackathons, symposiums, bootcamps, and meetups — all in one place for students and innovators.
        </p>
      </div>

      <div className="mb-6">
        <EventFilters filters={filters} onChange={setFilter} onClear={clearFilters} resultCount={events.length} />
      </div>

      <div className="flex items-center justify-end mb-4 gap-2">
        <span className="text-sm text-gray-500 mr-1">View:</span>
        <button onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Grid
        </button>
        <button onClick={() => setViewMode('map')} aria-pressed={viewMode === 'map'} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          Map
        </button>
      </div>

      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
        <div className="lg:col-span-3">
          <EventGrid events={events} loading={loading} bookmarkedIds={bookmarkedIds} onBookmark={toggleBookmark} onClearFilters={clearFilters} />
        </div>
        <div className="lg:col-span-2 h-[600px] sticky top-20">
          <EventMap events={events} onMarkerClick={setSelectedEventId} selectedEventId={selectedEventId} />
        </div>
      </div>

      <div className="lg:hidden">
        {viewMode === 'grid'
          ? <EventGrid events={events} loading={loading} bookmarkedIds={bookmarkedIds} onBookmark={toggleBookmark} onClearFilters={clearFilters} />
          : <div className="h-[500px]"><EventMap events={events} onMarkerClick={setSelectedEventId} selectedEventId={selectedEventId} /></div>
        }
      </div>
    </div>
  )
}
