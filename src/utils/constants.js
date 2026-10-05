// Event categories (matches DB CHECK constraint)
export const CATEGORIES = [
  { value: 'hackathon',  label: 'Hackathon' },
  { value: 'symposium',  label: 'Symposium' },
  { value: 'bootcamp',   label: 'Bootcamp' },
  { value: 'meetup',     label: 'Meetup' },
  { value: 'workshop',   label: 'Workshop' },
  { value: 'community',  label: 'Community' },
]

// Technical / professional domains
export const DOMAINS = [
  { value: 'AI/ML',          label: 'AI / ML' },
  { value: 'Web Dev',        label: 'Web Dev' },
  { value: 'Hardware/IoT',   label: 'Hardware / IoT' },
  { value: 'Business',       label: 'Business' },
  { value: 'Design',         label: 'Design' },
  { value: 'Data Science',   label: 'Data Science' },
  { value: 'Cybersecurity',  label: 'Cybersecurity' },
  { value: 'Other',          label: 'Other' },
]

// Madurai micro-locations
export const MICRO_LOCATIONS = [
  { value: 'Anna Nagar',    label: 'Anna Nagar' },
  { value: 'KK Nagar',      label: 'KK Nagar' },
  { value: 'Tallakulam',    label: 'Tallakulam' },
  { value: 'Madurai South', label: 'Madurai South' },
  { value: 'Pasumalai',     label: 'Pasumalai' },
  { value: 'Othakadai',     label: 'Othakadai' },
  { value: 'Usilampatti',   label: 'Usilampatti' },
  { value: 'Other',         label: 'Other' },
]

// Category badge colors (Tailwind bg + text classes)
export const CATEGORY_STYLES = {
  hackathon: { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
  symposium: { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  bootcamp:  { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  meetup:    { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  workshop:  { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  community: { bg: 'bg-pink-100',   text: 'text-pink-700',   dot: 'bg-pink-500' },
}

// Madurai city center for Leaflet default view
export const MADURAI_CENTER = [9.9252, 78.1198]
export const MADURAI_ZOOM   = 12

// Debounce delay for search input (ms)
export const SEARCH_DEBOUNCE_MS = 300

// Approximate centre of each micro-location — used to pre-fill map coordinates
// when an organizer doesn't pick an exact point.
export const AREA_COORDS = {
  'Anna Nagar':    [9.9390, 78.1322],
  'KK Nagar':      [9.9601, 78.0881],
  'Tallakulam':    [9.9312, 78.1205],
  'Madurai South': [9.8933, 78.1108],
  'Pasumalai':     [9.9010, 78.0754],
  'Othakadai':     [9.9489, 78.1567],
  'Usilampatti':   [9.9693, 77.7860],
}
