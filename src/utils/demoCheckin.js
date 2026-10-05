// ── Demo QR Check-in Utilities ─────────────────────────────────────────────────
// All data is stored in localStorage only.  No personal details are included
// in tokens — they contain only an eventId and a random registration ID.
// Real production check-in requires backend schema + API work (see bottom).
// ──────────────────────────────────────────────────────────────────────────────

const REGISTRATIONS_KEY = 'eventsphere_demo_registrations'
const CHECKINS_KEY      = 'eventsphere_demo_checkins'

// ── Token format ───────────────────────────────────────────────────────────────
// "ES-<eventId>-<8 random hex chars>"
// Small, human-readable for manual entry, safe to embed in a QR code.
// Contains no personal data.

export function generateToken(eventId) {
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return `ES-${eventId}-${rand}`
}

export function parseToken(token) {
  const parts = String(token ?? '').trim().split('-')
  // Format: ES - <eventId part 1> - ... - <8 hex chars>
  // eventId itself may contain hyphens (UUIDs), so we extract prefix + suffix
  if (parts.length < 3 || parts[0] !== 'ES') return null
  const rand    = parts[parts.length - 1]
  const eventId = parts.slice(1, -1).join('-')
  if (!eventId || rand.length !== 8) return null
  return { eventId, rand }
}

// ── Registrations ──────────────────────────────────────────────────────────────
// Stored as: [{ eventId, token, registeredAt }, ...]

export function getDemoRegistrations() {
  try {
    const raw = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export function getRegistrationForEvent(eventId) {
  return getDemoRegistrations().find(r => r.eventId === eventId) ?? null
}

/** Register for a demo event. Returns the new registration object.
 *  Idempotent — returns the existing registration if already registered. */
export function registerForDemoEvent(eventId) {
  const existing = getRegistrationForEvent(eventId)
  if (existing) return existing

  const reg = { eventId, token: generateToken(eventId), registeredAt: new Date().toISOString() }
  const all = getDemoRegistrations()
  all.push(reg)
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(all))
  return reg
}

// ── Check-ins ──────────────────────────────────────────────────────────────────
// Stored as: { [token]: { checkedInAt, eventId } }

export function getDemoCheckins() {
  try {
    return JSON.parse(localStorage.getItem(CHECKINS_KEY) || '{}')
  } catch {
    return {}
  }
}

/** Returns one of: 'ok' | 'already_checked_in' | 'invalid_token' */
export function processCheckin(rawToken) {
  const token   = String(rawToken ?? '').trim().toUpperCase()
  const parsed  = parseToken(token)
  if (!parsed) return { status: 'invalid_token' }

  // Find the matching registration
  const reg = getDemoRegistrations().find(
    r => r.token.toUpperCase() === token
  )
  if (!reg) return { status: 'invalid_token' }

  const checkins = getDemoCheckins()
  if (checkins[token]) {
    return { status: 'already_checked_in', checkedInAt: checkins[token].checkedInAt }
  }

  const entry = { eventId: reg.eventId, checkedInAt: new Date().toISOString() }
  checkins[token] = entry
  localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkins))
  return { status: 'ok', ...entry }
}

/** QR image URL — uses the free qrserver.com API; no API key, no personal data */
export function qrImageUrl(token, size = 200) {
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(token)}&size=${size}x${size}&margin=4`
}

// ── Production check-in — what's needed ───────────────────────────────────────
// To support real users, the following backend work is required:
//   1. DB: add `registrations` table (id, user_id, event_id, token UUID, checked_in_at)
//   2. DB: add `check_ins` table (registration_id, scanned_by, scanned_at)
//   3. API: POST /api/events/:id/register  — creates registration + returns token
//   4. API: POST /api/checkin              — verifies token, marks checked_in_at
//   5. API: GET  /api/organizer/events/:id/checkins — lists all check-ins for dashboard
//   6. Frontend: replace localStorage calls with API calls when !user.isDemo
