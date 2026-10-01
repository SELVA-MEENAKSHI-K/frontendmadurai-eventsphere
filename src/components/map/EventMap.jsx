import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { MADURAI_CENTER, MADURAI_ZOOM } from '../../utils/constants'
import { createCategoryMarker } from '../../utils/mapUtils'
import MapMarkerPopup from './MapMarkerPopup'

function MapUpdater({ events }) {
  const map = useMap()
  useEffect(() => {
    const withCoords = events.filter(e => e.latitude && e.longitude)
    if (withCoords.length === 0) map.setView(MADURAI_CENTER, MADURAI_ZOOM)
  }, [events, map])
  return null
}

export default function EventMap({ events = [], onMarkerClick, selectedEventId }) {
  const eventsWithCoords = events.filter(e => e.latitude != null && e.longitude != null)
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ minHeight: '400px' }}>
      <MapContainer center={MADURAI_CENTER} zoom={MADURAI_ZOOM} scrollWheelZoom={true} className="w-full h-full" style={{ minHeight: '400px' }} aria-label="Madurai events map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        <MapUpdater events={eventsWithCoords} />
        {eventsWithCoords.map(event => (
          <Marker key={event.id} position={[parseFloat(event.latitude), parseFloat(event.longitude)]} icon={createCategoryMarker(event.category)} eventHandlers={{ click: () => onMarkerClick && onMarkerClick(event.id) }}>
            <Popup minWidth={180} maxWidth={240}><MapMarkerPopup event={event} /></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
