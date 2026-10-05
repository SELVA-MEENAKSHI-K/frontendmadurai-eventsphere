export const SORT_OPTIONS = [
  { value: 'soonest', label: 'Starting soonest' },
  { value: 'closing', label: 'Closing soon' },
]

/**
 * Returns a new sorted array. Never mutates the input.
 *  - soonest: by event_date ascending (TBA last)
 *  - closing: open deadlines first (nearest first), then no-deadline events,
 *             then events whose registration already closed
 */
export function sortEvents(events, mode = 'soonest', now = new Date()) {
  const list = [...events]
  const time = v => (v ? new Date(v).getTime() : Infinity)
  if (mode === 'closing') {
    const rank = e => {
      if (!e.deadline) return 1
      return new Date(e.deadline) < now ? 2 : 0
    }
    return list.sort(
      (a, b) =>
        rank(a) - rank(b) ||
        (rank(a) === 0 ? time(a.deadline) - time(b.deadline) : 0) ||
        time(a.event_date) - time(b.event_date)
    )
  }
  return list.sort((a, b) => time(a.event_date) - time(b.event_date))
}

/** How many events have an open deadline within `days` days. */
export function countClosingSoon(events, days = 7, now = new Date()) {
  return events.filter(e => {
    if (!e.deadline) return false
    const diff = new Date(e.deadline) - now
    return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
  }).length
}
