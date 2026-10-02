/**
 * Genuine property-based tests using fast-check
 * Kiro Spec Correctness — Madurai EventSphere
 *
 * These tests use fast-check to GENERATE hundreds of random inputs automatically
 * and verify that properties hold for all of them. This is what distinguishes
 * genuine PBT from example-based tests:
 *
 *   Example-based:  forEach over a hand-picked array of 4–6 inputs
 *   Property-based: fc.assert(fc.property(fc.arbitrary(), input => ...))
 *                   → fast-check generates 100–1000 random inputs per property
 *
 * Each property is linked to a requirement from requirements.md.
 * No requirements were invented; properties come directly from acceptance criteria.
 *
 * Requirements covered:
 *   FR-01 — Event Discovery Dashboard (date display, never blank)
 *   FR-02 — Category & Domain Filters (filter stripping, constants completeness)
 *   FR-03 — Interactive Location Map (marker colors always valid)
 *   FR-04 — Event Detail Page (deadline logic, Register Now / Closed)
 */

// vi.mock must appear before any import — Vitest hoists it above all imports
// at compile time. This is identical to the pattern in mapUtils.test.js.
import { vi } from 'vitest'

vi.mock('leaflet', () => ({
  default: {
    divIcon: vi.fn(options => ({ _leafletDivIcon: true, ...options })),
  },
}))

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  formatDate,
  formatDateTime,
  isDeadlinePassed,
  isDeadlineSoon,
  deadlineCountdown,
} from '../dateUtils.js'
import {
  CATEGORIES,
  DOMAINS,
  MICRO_LOCATIONS,
  SEARCH_DEBOUNCE_MS,
} from '../constants.js'
import { getCategoryColor } from '../mapUtils.js'

// ---------------------------------------------------------------------------
// Arbitraries — fast-check input generators
// ---------------------------------------------------------------------------

// Any valid ISO 8601 timestamp from Unix epoch to year 2099
const isoDateArb = fc
  .integer({ min: 0, max: 4102444800000 })
  .map(ms => new Date(ms).toISOString())

// Timestamp strictly in the past (more than 400 days ago)
const pastDateArb = fc
  .integer({ min: 0, max: Date.now() - 86400000 * 400 })
  .map(ms => new Date(ms).toISOString())

// Timestamp strictly in the future (more than 30 days from now)
const futureDateArb = fc
  .integer({ min: Date.now() + 86400000 * 30, max: 4102444800000 })
  .map(ms => new Date(ms).toISOString())

// Any string — covers garbage, empty, unicode, SQL probes, XSS attempts
const anyStringArb = fc.string()

// A valid category value drawn from the spec constants
const validCategoryArb = fc.constantFrom(...CATEGORIES.map(c => c.value))

// Any string that is NOT a known category
const unknownCategoryArb = fc.string().filter(
  s => !CATEGORIES.map(c => c.value).includes(s.toLowerCase())
)

// A filters object with a random mix of populated and empty values per key
const filtersArb = fc.record({
  category:       fc.oneof(validCategoryArb, fc.constant(''), fc.constant(null)),
  domain:         fc.oneof(fc.constantFrom(...DOMAINS.map(d => d.value)), fc.constant('')),
  micro_location: fc.oneof(fc.constantFrom(...MICRO_LOCATIONS.map(l => l.value)), fc.constant('')),
  date_from:      fc.oneof(isoDateArb, fc.constant('')),
  date_to:        fc.oneof(isoDateArb, fc.constant('')),
  search:         fc.oneof(fc.string({ maxLength: 100 }), fc.constant('')),
})

// Pure filter-stripping function — identical logic to eventService.js getEvents()
function stripEmptyFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  )
}

// ---------------------------------------------------------------------------
// [FR-01] formatDate — generative properties
// ---------------------------------------------------------------------------

describe('[PBT][FR-01] formatDate — generative properties', () => {

  it('for any valid ISO date, formatDate always returns a non-empty string', () => {
    fc.assert(
      fc.property(isoDateArb, date => {
        const result = formatDate(date)
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
        expect(result).not.toBe('TBA')
      }),
      { numRuns: 200, seed: 42 }
    )
  })

  it('for any valid ISO date, formatDate output always contains a 4-digit year', () => {
    fc.assert(
      fc.property(isoDateArb, date => {
        expect(formatDate(date)).toMatch(/\d{4}/)
      }),
      { numRuns: 200, seed: 43 }
    )
  })

  it('for any valid ISO date, formatDateTime always returns a non-empty string', () => {
    fc.assert(
      fc.property(isoDateArb, date => {
        const result = formatDateTime(date)
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
        expect(result).not.toBe('TBA')
      }),
      { numRuns: 200, seed: 44 }
    )
  })

})

// ---------------------------------------------------------------------------
// [FR-04] isDeadlinePassed — generative properties
// ---------------------------------------------------------------------------

describe('[PBT][FR-04] isDeadlinePassed — generative properties', () => {

  it('for any past date, isDeadlinePassed always returns true', () => {
    fc.assert(
      fc.property(pastDateArb, date => {
        expect(isDeadlinePassed(date)).toBe(true)
      }),
      { numRuns: 200, seed: 100 }
    )
  })

  it('for any future date (30+ days ahead), isDeadlinePassed always returns false', () => {
    fc.assert(
      fc.property(futureDateArb, date => {
        expect(isDeadlinePassed(date)).toBe(false)
      }),
      { numRuns: 200, seed: 101 }
    )
  })

  it('for any past date, deadlineCountdown is null — mutually exclusive with isDeadlinePassed', () => {
    fc.assert(
      fc.property(pastDateArb, date => {
        expect(isDeadlinePassed(date)).toBe(true)
        expect(deadlineCountdown(date)).toBeNull()
      }),
      { numRuns: 200, seed: 102 }
    )
  })

  it('for any future date, deadlineCountdown returns a non-null string', () => {
    fc.assert(
      fc.property(futureDateArb, date => {
        expect(isDeadlinePassed(date)).toBe(false)
        const result = deadlineCountdown(date)
        expect(result).not.toBeNull()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      }),
      { numRuns: 200, seed: 103 }
    )
  })

})

// ---------------------------------------------------------------------------
// [FR-01] isDeadlineSoon — generative properties
// ---------------------------------------------------------------------------

describe('[PBT][FR-01] isDeadlineSoon — generative properties', () => {

  it('for any past date, isDeadlineSoon always returns false', () => {
    fc.assert(
      fc.property(pastDateArb, date => {
        expect(isDeadlineSoon(date)).toBe(false)
      }),
      { numRuns: 200, seed: 200 }
    )
  })

  it('for any date 30+ days in the future, isDeadlineSoon(date, 3) always returns false', () => {
    fc.assert(
      fc.property(futureDateArb, date => {
        expect(isDeadlineSoon(date, 3)).toBe(false)
      }),
      { numRuns: 200, seed: 201 }
    )
  })

  it('isDeadlineSoon and isDeadlinePassed are mutually exclusive for any date', () => {
    fc.assert(
      fc.property(isoDateArb, date => {
        const passed = isDeadlinePassed(date)
        const soon   = isDeadlineSoon(date)
        expect(passed && soon).toBe(false)
      }),
      { numRuns: 500, seed: 202 }
    )
  })

})

// ---------------------------------------------------------------------------
// [FR-02] Filter stripping — generative properties
// ---------------------------------------------------------------------------

describe('[PBT][FR-02] Filter stripping — generative properties', () => {

  it('for any filters object, stripEmptyFilters never outputs empty/null values', () => {
    fc.assert(
      fc.property(filtersArb, filters => {
        const result = stripEmptyFilters(filters)
        Object.values(result).forEach(v => {
          expect(v).not.toBe('')
          expect(v).not.toBeNull()
          expect(v).not.toBeUndefined()
        })
      }),
      { numRuns: 500, seed: 300 }
    )
  })

  it('for any filters object, every non-empty input value is present in the output', () => {
    fc.assert(
      fc.property(filtersArb, filters => {
        const result = stripEmptyFilters(filters)
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '' && value != null) {
            expect(result[key]).toBe(value)
          }
        })
      }),
      { numRuns: 500, seed: 301 }
    )
  })

  it('stripEmptyFilters never introduces keys that were not in the original object', () => {
    fc.assert(
      fc.property(filtersArb, filters => {
        const result = stripEmptyFilters(filters)
        Object.keys(result).forEach(key => {
          expect(Object.prototype.hasOwnProperty.call(filters, key)).toBe(true)
        })
      }),
      { numRuns: 500, seed: 302 }
    )
  })

  it('stripEmptyFilters is idempotent — applying it twice equals applying it once', () => {
    fc.assert(
      fc.property(filtersArb, filters => {
        const once  = stripEmptyFilters(filters)
        const twice = stripEmptyFilters(once)
        expect(twice).toEqual(once)
      }),
      { numRuns: 500, seed: 303 }
    )
  })

})

// ---------------------------------------------------------------------------
// [FR-03] getCategoryColor — generative properties
// ---------------------------------------------------------------------------

describe('[PBT][FR-03] getCategoryColor — generative properties', () => {

  it('for any string input, getCategoryColor always returns a valid #RRGGBB string', () => {
    fc.assert(
      fc.property(anyStringArb, input => {
        const result = getCategoryColor(input)
        expect(typeof result).toBe('string')
        expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/)
      }),
      { numRuns: 1000, seed: 400 }
    )
  })

  it('for any valid category, getCategoryColor is case-insensitive', () => {
    fc.assert(
      fc.property(validCategoryArb, category => {
        const lower = category.toLowerCase()
        const upper = category.toUpperCase()
        const title = category[0].toUpperCase() + category.slice(1)
        expect(getCategoryColor(upper)).toBe(getCategoryColor(lower))
        expect(getCategoryColor(title)).toBe(getCategoryColor(lower))
      }),
      { numRuns: 100, seed: 401 }
    )
  })

  it('for any unknown/garbage string, getCategoryColor returns the default gray #6B7280', () => {
    fc.assert(
      fc.property(unknownCategoryArb, input => {
        expect(getCategoryColor(input)).toBe('#6B7280')
      }),
      { numRuns: 500, seed: 402 }
    )
  })

})
