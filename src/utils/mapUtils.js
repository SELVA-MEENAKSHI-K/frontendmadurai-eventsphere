import L from 'leaflet'

// Category → hex color (matches design.md §7 and tailwind.config.js)
const CATEGORY_COLORS = {
  hackathon: '#EF4444',
  symposium: '#3B82F6',
  bootcamp:  '#8B5CF6',
  meetup:    '#10B981',
  workshop:  '#F59E0B',
  community: '#EC4899',
}

const DEFAULT_COLOR = '#6B7280'

/**
 * Returns the hex color for a given event category.
 */
export function getCategoryColor(category) {
  return CATEGORY_COLORS[category?.toLowerCase()] ?? DEFAULT_COLOR
}

/**
 * Creates a custom Leaflet DivIcon with a colored SVG pin for a given category.
 */
export function createCategoryMarker(category) {
  const color = getCategoryColor(category)

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path
        d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="${color}"
        stroke="#fff"
        stroke-width="2"
      />
      <circle cx="14" cy="14" r="5" fill="#fff" opacity="0.9" />
    </svg>
  `.trim()

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  })
}
