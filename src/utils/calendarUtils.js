const DEFAULT_DURATION_HOURS = 3

function toICSDate(input) {
  return new Date(input).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeICS(text = '') {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function endDateFor(event) {
  const start = new Date(event.event_date)
  return new Date(start.getTime() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000)
}

function locationFor(event) {
  return [event.venue_name, event.address || event.micro_location, 'Madurai']
    .filter(Boolean)
    .join(', ')
}

/** Build the text of an .ics file for an event. Returns null if no valid date. */
export function buildICS(event, now = new Date()) {
  if (!event?.event_date || Number.isNaN(new Date(event.event_date).getTime())) return null
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Madurai EventSphere//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@madurai-eventsphere`,
    `DTSTAMP:${toICSDate(now)}`,
    `DTSTART:${toICSDate(event.event_date)}`,
    `DTEND:${toICSDate(endDateFor(event))}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description ?? '')}`,
    `LOCATION:${escapeICS(locationFor(event))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

/** Google Calendar "template" link. Returns null if no valid date. */
export function googleCalendarUrl(event) {
  if (!event?.event_date || Number.isNaN(new Date(event.event_date).getTime())) return null
  const params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     event.title ?? 'Event',
    dates:    `${toICSDate(event.event_date)}/${toICSDate(endDateFor(event))}`,
    details:  event.description ?? '',
    location: locationFor(event),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Trigger a browser download of the event as an .ics file. */
export function downloadICS(event) {
  const ics = buildICS(event)
  if (!ics) return false
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${(event.title ?? 'event').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
  return true
}
