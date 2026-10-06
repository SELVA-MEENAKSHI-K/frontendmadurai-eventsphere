/** "Selva Meenakshi K" -> "SM"; falls back to email, then "U". */
export function getInitials(nameOrEmail) {
  const source = (nameOrEmail || 'U').trim() || 'U'
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('') || 'U'
}

/**
 * Profile completeness: name, college, verified account.
 * Returns { percent, missing: string[] }.
 */
export function profileCompleteness({ fullName, college, isDemo = false }) {
  const steps = [
    { label: 'Add your full name', done: Boolean(fullName && fullName.trim()) },
    { label: 'Add your college',   done: Boolean(college && college.trim()) },
    { label: 'Sign in with a real account', done: !isDemo },
  ]
  const done = steps.filter(s => s.done).length
  return {
    percent: Math.round((done / steps.length) * 100),
    missing: steps.filter(s => !s.done).map(s => s.label),
  }
}

/** Count how many registrations have a matching check-in. */
export function countCheckedIn(registrations = [], checkins = {}) {
  return registrations.filter(r => {
    const token = String(r.token ?? '')
    return Boolean(checkins[token.toUpperCase()] || checkins[token])
  }).length
}
