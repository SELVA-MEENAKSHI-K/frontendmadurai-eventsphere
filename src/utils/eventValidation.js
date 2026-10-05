import { CATEGORIES, MICRO_LOCATIONS, AREA_COORDS } from './constants'

export const EMPTY_EVENT_FORM = {
  title:            '',
  category:         '',
  domain:           [],
  description:      '',
  venue_name:       '',
  address:          '',
  micro_location:   '',
  event_date:       '',   // datetime-local string
  deadline:         '',   // datetime-local string
  eligibility:      '',
  registration_url: '',
  poster_url:       '',
  latitude:         '',
  longitude:        '',
}

function isHttpUrl(value) {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/** Returns { fieldName: 'message' }. Empty object means valid. */
export function validateEventForm(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Title is required.'
  else if (form.title.trim().length > 120) errors.title = 'Keep the title under 120 characters.'

  if (!CATEGORIES.some(c => c.value === form.category))       errors.category      = 'Pick a category.'
  if (!form.venue_name.trim())                                  errors.venue_name    = 'Venue name is required.'
  if (!MICRO_LOCATIONS.some(l => l.value === form.micro_location)) errors.micro_location = 'Pick an area.'

  if (!form.event_date) errors.event_date = 'Event date & time is required.'
  else if (Number.isNaN(new Date(form.event_date).getTime())) errors.event_date = 'Invalid date.'

  if (form.deadline) {
    if (Number.isNaN(new Date(form.deadline).getTime())) {
      errors.deadline = 'Invalid date.'
    } else if (form.event_date && new Date(form.deadline) > new Date(form.event_date)) {
      errors.deadline = 'Deadline must be on or before the event date.'
    }
  }

  if (form.registration_url && !isHttpUrl(form.registration_url)) {
    errors.registration_url = 'Enter a full link starting with http:// or https://'
  }
  if (form.poster_url && !isHttpUrl(form.poster_url)) {
    errors.poster_url = 'Enter a full image link starting with http:// or https://'
  }

  const hasLat = form.latitude !== '' && form.latitude != null
  const hasLng = form.longitude !== '' && form.longitude != null
  if (hasLat !== hasLng) {
    errors.latitude = 'Give both latitude and longitude, or leave both blank.'
  } else if (hasLat) {
    const lat = Number(form.latitude)
    const lng = Number(form.longitude)
    if (!(lat >= -90  && lat <= 90))  errors.latitude  = 'Latitude must be between -90 and 90.'
    if (!(lng >= -180 && lng <= 180)) errors.longitude = 'Longitude must be between -180 and 180.'
  }
  return errors
}

/** ISO string -> value for <input type="datetime-local"> (local time). */
export function isoToLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Existing DB event -> form state. */
export function eventToForm(event) {
  return {
    ...EMPTY_EVENT_FORM,
    ...Object.fromEntries(
      Object.entries(event).filter(([k]) => k in EMPTY_EVENT_FORM && event[k] != null)
    ),
    domain:     event.domain ?? [],
    event_date: isoToLocalInput(event.event_date),
    deadline:   isoToLocalInput(event.deadline),
    latitude:   event.latitude  ?? '',
    longitude:  event.longitude ?? '',
  }
}

/** Form state -> API payload. Falls back to the area centre for coordinates. */
export function formToPayload(form, isPublished) {
  const area      = AREA_COORDS[form.micro_location]
  const hasCoords = form.latitude !== '' && form.longitude !== ''
  return {
    title:            form.title.trim(),
    category:         form.category,
    domain:           form.domain,
    description:      form.description.trim() || null,
    venue_name:       form.venue_name.trim(),
    address:          form.address.trim() || null,
    micro_location:   form.micro_location,
    latitude:         hasCoords ? Number(form.latitude)  : (area?.[0] ?? null),
    longitude:        hasCoords ? Number(form.longitude) : (area?.[1] ?? null),
    event_date:       new Date(form.event_date).toISOString(),
    deadline:         form.deadline ? new Date(form.deadline).toISOString() : null,
    eligibility:      form.eligibility.trim() || null,
    registration_url: form.registration_url.trim() || null,
    poster_url:       form.poster_url.trim() || null,
    is_published:     isPublished,
  }
}
