import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import EventGrid from '../components/events/EventGrid'
import useBookmarks from '../hooks/useBookmarks'
import { useAuth } from '../context/AuthContext'
import { getBookmarks } from '../services/bookmarkService'
import EmptyState from '../components/common/EmptyState'
import sampleEvents from '../data/sampleEvents'
import { getDemoRegistrations } from '../utils/demoCheckin'
import { mergeSavedEvents } from '../utils/bookmarkUtils'

export default function BookmarksPage() {
  const { user }                          = useAuth()
  const { bookmarkedIds, toggleBookmark } = useBookmarks()
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const isDemo = Boolean(user?.isDemo)

  useEffect(() => {
    if (isDemo) {
      // Demo mode — bookmarked events + events the user registered for (local only)
      setEvents(mergeSavedEvents(sampleEvents, bookmarkedIds, getDemoRegistrations()))
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await getBookmarks()
        const bookmarkedEvents = (result.data ?? [])
          .map(b => b.event)
          .filter(Boolean)
        setEvents(bookmarkedEvents)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  // Re-run when bookmarkedIds changes so demo list stays in sync after toggling
  }, [isDemo, bookmarkedIds])

  // Remove from local list immediately when unbookmarked
  function handleBookmark(eventId) {
    // Registered events stay on this page — they come from your registrations, not just a bookmark
    if (isDemo && events.find(e => e.id === eventId)?._registered) {
      toast('You are registered for this event, so it stays here.', { icon: '✅' })
      return
    }
    toggleBookmark(eventId)
    if (!isDemo) {
      setEvents(prev => prev.filter(e => e.id !== eventId))
    }
    // Demo list updates automatically via the bookmarkedIds dependency above
  }

  // Registered events always show a filled bookmark icon
  const cardBookmarkedIds = new Set([...bookmarkedIds, ...events.filter(e => e._registered).map(e => e.id)])

  return (
    <>
      <Helmet>
        <title>My Bookmarks — Madurai EventSphere</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isDemo
              ? 'Demo mode — bookmarks and registrations are saved locally in your browser.'
              : "Events you've saved for later"}
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500 text-center mb-4">{error}</p>
        )}

        {isDemo && !loading && events.some(e => e._registered) && (
          <p className="text-sm mb-4">
            <Link to="/my-registrations" className="font-semibold text-saffron-600 hover:underline">
              View QR codes for your registrations →
            </Link>
          </p>
        )}

        {!loading && !error && events.length === 0 ? (
          <EmptyState
            title="No saved events yet"
            message="Tap the bookmark icon on an event, or register for one, and it will show up here."
          />
        ) : (
          <EventGrid
            events={events}
            loading={loading}
            bookmarkedIds={cardBookmarkedIds}
            onBookmark={handleBookmark}
            onClearFilters={null}
          />
        )}
      </div>
    </>
  )
}
