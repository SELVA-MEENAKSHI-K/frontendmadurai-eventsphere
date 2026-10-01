/**
 * Property-based tests for dateUtils.js
 * Kiro Spec Correctness — Madurai EventSphere
 *
 * Each test is linked to a requirement ID from requirements.md.
 * Properties are universal: they must hold for ALL valid inputs in the described set.
 * No requirements were invented; all properties derive directly from FR-01 and FR-04.
 */

import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateTime,
  isDeadlinePassed,
  isDeadlineSoon,
  deadlineCountdown,
} from '../dateUtils.js'

// ---------------------------------------------------------------------------
// Shared date corpus — varied and boundary inputs
// ---------------------------------------------------------------------------

// Far-future dates (years 2030–9999): isDeadlinePassed must be false
const FAR_FUTURE_DATES = [
  '2030-01-01T00:00:00Z',
  '2099-12-31T23:59:59Z',
  '9999-12-31T23:59:59Z',
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(), // +1 year
]

// Far-past dates (years 2000–2025): isDeadlinePassed must be true
const FAR_PAST_DATES = [
  '2000-01-01T00:00:00Z',
  '2020-06-15T12:00:00Z',
  '2025-09-30T23:59:59Z',
  new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(), // -1 year
]

// Valid ISO date strings that should produce real output, not 'TBA'
const VALID_DATE_STRINGS = [
  '2026-11-15T09:00:00Z',
  '2024-03-08T00:00:00Z',
  '1970-01-01T00:00:00Z',   // Unix epoch — boundary
  '2026-12-31T23:59:59Z',
  '2026-01-01T00:00:00Z',
  new Date(2026, 10, 15).toISOString(),
]

// Null / undefined / falsy inputs
const NULLISH_INPUTS = [null, undefined, '', 0, false]

// Dates that are 10+ days in the future — never "soon" within 3-day window
const NOT_SOON_DATES = FAR_FUTURE_DATES

// ---------------------------------------------------------------------------
// P1 — FR-01: formatDate(null/undefined/falsy) always returns 'TBA'
// ---------------------------------------------------------------------------
describe('P1 [FR-01] formatDate — nullish/falsy inputs always return TBA', () => {
  NULLISH_INPUTS.forEach(input => {
    it(`formatDate(${JSON.stringify(input)}) === 'TBA'`, () => {
      expect(formatDate(input)).toBe('TBA')
    })
  })
})

// ---------------------------------------------------------------------------
// P2 — FR-01: formatDate(validDate) returns a non-empty string that is not 'TBA'
// ---------------------------------------------------------------------------
describe('P2 [FR-01] formatDate — valid dates return a non-empty non-TBA string', () => {
  VALID_DATE_STRINGS.forEach(input => {
    it(`formatDate("${input}") is non-empty and not 'TBA'`, () => {
      const result = formatDate(input)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
      expect(result).not.toBe('TBA')
    })
  })
})

// ---------------------------------------------------------------------------
// P3 — FR-01: formatDate output always contains a 4-digit year for valid dates
// ---------------------------------------------------------------------------
describe('P3 [FR-01] formatDate — output always contains a 4-digit year', () => {
  VALID_DATE_STRINGS.forEach(input => {
    it(`formatDate("${input}") contains a 4-digit year`, () => {
      const result = formatDate(input)
      expect(result).toMatch(/\d{4}/)
    })
  })
})

// ---------------------------------------------------------------------------
// P4 (partial) — formatDateTime nullish inputs return 'TBA'
// (supports FR-01: event cards must never show a blank date/time)
// ---------------------------------------------------------------------------
describe('[FR-01] formatDateTime — nullish/falsy inputs always return TBA', () => {
  NULLISH_INPUTS.forEach(input => {
    it(`formatDateTime(${JSON.stringify(input)}) === 'TBA'`, () => {
      expect(formatDateTime(input)).toBe('TBA')
    })
  })
})

// ---------------------------------------------------------------------------
// P9 — FR-04: isDeadlinePassed(null/undefined) always returns false
// (no deadline set → registration never considered closed)
// ---------------------------------------------------------------------------
describe('P9 [FR-04] isDeadlinePassed — null/undefined always returns false', () => {
  NULLISH_INPUTS.forEach(input => {
    it(`isDeadlinePassed(${JSON.stringify(input)}) === false`, () => {
      expect(isDeadlinePassed(input)).toBe(false)
    })
  })
})

// ---------------------------------------------------------------------------
// P10 — FR-04: isDeadlinePassed(farFuture) always returns false
// ---------------------------------------------------------------------------
describe('P10 [FR-04] isDeadlinePassed — far-future dates always return false', () => {
  FAR_FUTURE_DATES.forEach(date => {
    it(`isDeadlinePassed("${date}") === false`, () => {
      expect(isDeadlinePassed(date)).toBe(false)
    })
  })
})

// ---------------------------------------------------------------------------
// P11 — FR-04: isDeadlinePassed(farPast) always returns true
// ---------------------------------------------------------------------------
describe('P11 [FR-04] isDeadlinePassed — far-past dates always return true', () => {
  FAR_PAST_DATES.forEach(date => {
    it(`isDeadlinePassed("${date}") === true`, () => {
      expect(isDeadlinePassed(date)).toBe(true)
    })
  })
})

// ---------------------------------------------------------------------------
// P12 — FR-04: isDeadlinePassed and deadlineCountdown are mutually exclusive
// If deadline has passed, countdown must be null (not a string like "3 days left")
// ---------------------------------------------------------------------------
describe('P12 [FR-04] isDeadlinePassed and deadlineCountdown are mutually exclusive', () => {
  FAR_PAST_DATES.forEach(date => {
    it(`when isDeadlinePassed("${date}") is true, deadlineCountdown returns null`, () => {
      expect(isDeadlinePassed(date)).toBe(true)
      expect(deadlineCountdown(date)).toBeNull()
    })
  })

  FAR_FUTURE_DATES.forEach(date => {
    it(`when isDeadlinePassed("${date}") is false, deadlineCountdown returns a string`, () => {
      expect(isDeadlinePassed(date)).toBe(false)
      const countdown = deadlineCountdown(date)
      expect(typeof countdown).toBe('string')
      expect(countdown.length).toBeGreaterThan(0)
    })
  })
})

// ---------------------------------------------------------------------------
// P13 — FR-01: isDeadlineSoon(null) always returns false
// ---------------------------------------------------------------------------
describe('P13 [FR-01] isDeadlineSoon — null/undefined always returns false', () => {
  NULLISH_INPUTS.forEach(input => {
    it(`isDeadlineSoon(${JSON.stringify(input)}) === false`, () => {
      expect(isDeadlineSoon(input)).toBe(false)
    })
  })
})

// ---------------------------------------------------------------------------
// P14 — FR-01: if isDeadlinePassed(d) is true, isDeadlineSoon(d) must be false
// A passed deadline is never "soon"
// ---------------------------------------------------------------------------
describe('P14 [FR-01] isDeadlineSoon — passed deadline is never soon', () => {
  FAR_PAST_DATES.forEach(date => {
    it(`isDeadlinePassed("${date}")=true → isDeadlineSoon=false`, () => {
      expect(isDeadlinePassed(date)).toBe(true)
      expect(isDeadlineSoon(date)).toBe(false)
    })
  })
})

// ---------------------------------------------------------------------------
// P15 — FR-01: isDeadlineSoon(farFuture, 3) always returns false
// Events weeks/years away are not within 3-day urgency window
// ---------------------------------------------------------------------------
describe('P15 [FR-01] isDeadlineSoon — far-future dates not soon within 3-day window', () => {
  NOT_SOON_DATES.forEach(date => {
    it(`isDeadlineSoon("${date}", 3) === false`, () => {
      expect(isDeadlineSoon(date, 3)).toBe(false)
    })
  })
})

// ---------------------------------------------------------------------------
// P16 — FR-01: deadlineCountdown(null/undefined) always returns null
// ---------------------------------------------------------------------------
describe('P16 [FR-01] deadlineCountdown — null/undefined always returns null', () => {
  NULLISH_INPUTS.forEach(input => {
    it(`deadlineCountdown(${JSON.stringify(input)}) === null`, () => {
      expect(deadlineCountdown(input)).toBeNull()
    })
  })
})

// ---------------------------------------------------------------------------
// P17 — FR-04: deadlineCountdown(farPast) always returns null
// ---------------------------------------------------------------------------
describe('P17 [FR-04] deadlineCountdown — far-past dates always return null', () => {
  FAR_PAST_DATES.forEach(date => {
    it(`deadlineCountdown("${date}") === null`, () => {
      expect(deadlineCountdown(date)).toBeNull()
    })
  })
})

// ---------------------------------------------------------------------------
// Boundary: deadlineCountdown for a 1-day-future deadline returns "1 day left"
// ---------------------------------------------------------------------------
describe('[FR-04] deadlineCountdown — boundary: ~1 day away returns "1 day left"', () => {
  it('deadline ~23 hours from now returns "1 day left"', () => {
    const almostOneDayAway = new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString()
    expect(deadlineCountdown(almostOneDayAway)).toBe('1 day left')
  })
})

// ---------------------------------------------------------------------------
// Boundary: deadlineCountdown for 2-day-future deadline returns "2 days left"
// ---------------------------------------------------------------------------
describe('[FR-04] deadlineCountdown — boundary: ~2 days away returns "2 days left"', () => {
  it('deadline ~47 hours from now returns "2 days left"', () => {
    const almostTwoDaysAway = new Date(Date.now() + 1000 * 60 * 60 * 47).toISOString()
    expect(deadlineCountdown(almostTwoDaysAway)).toBe('2 days left')
  })
})
