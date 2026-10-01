/**
 * Format a date string or Date object to "Mon DD, YYYY"
 * e.g. "Nov 15, 2026"
 */
export function formatDate(dateInput) {
  if (!dateInput) return 'TBA'
  const date = new Date(dateInput)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format a date string to "Mon DD, YYYY at HH:MM AM/PM"
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return 'TBA'
  const date = new Date(dateInput)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Returns true if the given deadline date is in the past.
 */
export function isDeadlinePassed(deadline) {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

/**
 * Returns true if the deadline is within the next N days (default 3).
 * Used for urgency indicator on EventCard.
 */
export function isDeadlineSoon(deadline, days = 3) {
  if (!deadline) return false
  const now = new Date()
  const dl = new Date(deadline)
  if (dl < now) return false
  const diffMs = dl - now
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays <= days
}

/**
 * Returns a human-readable countdown string like "3 days left" or "Closes today".
 * Returns null if deadline has passed or is not set.
 */
export function deadlineCountdown(deadline) {
  if (!deadline) return null
  const now = new Date()
  const dl = new Date(deadline)
  if (dl < now) return null
  const diffMs = dl - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Closes today'
  if (diffDays === 1) return '1 day left'
  return `${diffDays} days left`
}
