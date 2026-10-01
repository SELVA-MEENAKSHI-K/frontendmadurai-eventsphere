import EventCard from './EventCard'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

export default function EventGrid({ events, loading, bookmarkedIds = new Set(), onBookmark, onClearFilters }) {
  if (loading) return <LoadingSpinner message="Loading events..." />
  if (!events || events.length === 0) {
    return <EmptyState title="No events found" message="Try adjusting your filters or search term to find events in Madurai." onClear={onClearFilters} />
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Events list">
      {events.map(event => (
        <EventCard key={event.id} event={event} isBookmarked={bookmarkedIds.has(event.id)} onBookmark={onBookmark} />
      ))}
    </div>
  )
}
