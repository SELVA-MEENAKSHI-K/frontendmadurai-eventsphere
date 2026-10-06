/**
 * Build the list shown on the Bookmarks page in demo mode.
 * Shows every bookmarked event AND every event the user registered for.
 * Registered events get `_registered: true` so the card can show a badge.
 * De-duplicated by event id, sorted by event date (TBA last).
 *
 * @param {Array}  events         all known demo/sample events
 * @param {Set}    bookmarkedIds  ids saved via the bookmark button
 * @param {Array}  registrations  [{ eventId, token, registeredAt }]
 */
export function mergeSavedEvents(events, bookmarkedIds, registrations = []) {
  const registeredIds = new Set(registrations.map(r => r.eventId))
  return events
    .filter(e => bookmarkedIds.has(e.id) || registeredIds.has(e.id))
    .map(e => (registeredIds.has(e.id) ? { ...e, _registered: true } : e))
    .sort((a, b) => {
      const ta = a.event_date ? new Date(a.event_date).getTime() : Infinity
      const tb = b.event_date ? new Date(b.event_date).getTime() : Infinity
      return ta - tb
    })
}
