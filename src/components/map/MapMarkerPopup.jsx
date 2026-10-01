import { Link } from 'react-router-dom'
import EventBadge from '../events/EventBadge'
import { formatDate } from '../../utils/dateUtils'

export default function MapMarkerPopup({ event }) {
  const { id, title, category, event_date, venue_name } = event
  return (
    <div className="min-w-[180px] max-w-[220px]">
      <p className="font-semibold text-gray-900 text-sm leading-snug mb-1.5">{title}</p>
      <div className="mb-1.5"><EventBadge category={category} /></div>
      <p className="text-xs text-gray-500 mb-0.5">{formatDate(event_date)}</p>
      <p className="text-xs text-gray-500 mb-3 truncate">{venue_name}</p>
      <Link to={`/events/${id}`} className="inline-block w-full text-center text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">View Details</Link>
    </div>
  )
}
