import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import EventGrid from '../components/events/EventGrid'
import useBookmarks from '../hooks/useBookmarks'
import { getBookmarks } from '../services/bookmarkService'

export default function BookmarksPage() {
  const { bookmarkedIds, toggleBookmark } = useBookmarks()
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await getBookmarks()
        // Each bookmark row has a nested event object from the backend join
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
  }, [])

  // Remove from local list immediately when unbookmarked
  function handleBookmark(eventId) {
    toggleBookmark(eventId)
    setEvents(prev => prev.filter(e => e.id !== eventId))
  }

  return (
    <>
      <Helmet>
        <title>My Bookmarks — Madurai EventSphere</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
          <p className="text-sm text-gray-500 mt-1">Events you&apos;ve saved for later</p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500 text-center mb-4">{error}</p>
        )}

        <EventGrid
          events={events}
          loading={loading}
          bookmarkedIds={bookmarkedIds}
          onBookmark={handleBookmark}
          onClearFilters={null}
        />
      </div>
    </>
  )
}
