import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { MADURAI_CENTER, MADURAI_ZOOM } from '../../utils/constants'
import { createCategoryMarker } from '../../utils/mapUtils'

/**
 * Listens for map clicks and calls onPick(lat, lng).
 * Rendered as a child of MapContainer so it has access to the map context.
 */
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

/**
 * Small embedded Leaflet map for picking an event location.
 * Click anywhere on the map to set latitude and longitude.
 *
 * Props:
 *   latitude   number | null  — current pinned latitude
 *   longitude  number | null  — current pinned longitude
 *   onPick     (lat: number, lng: number) => void
 */
export default function LocationPicker({ latitude, longitude, onPick }) {
  const hasPin = latitude != null && longitude != null

  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200"
      style={{ height: '220px' }}
    >
      <MapContainer
        center={hasPin ? [latitude, longitude] : MADURAI_CENTER}
        zoom={MADURAI_ZOOM}
        scrollWheelZoom={false}
        className="w-full h-full"
        aria-label="Click on the map to set the event location"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ClickHandler onPick={onPick} />
        {hasPin && (
          <Marker
            position={[latitude, longitude]}
            icon={createCategoryMarker('meetup')}
          />
        )}
      </MapContainer>
    </div>
  )
}
