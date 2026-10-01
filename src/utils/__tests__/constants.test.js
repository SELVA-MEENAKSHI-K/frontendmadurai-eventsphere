/**
 * Property-based tests for constants.js
 * Kiro Spec Correctness — Madurai EventSphere
 *
 * Each test is linked to a requirement ID from requirements.md.
 * Properties verify structural completeness of the shared constants that
 * drive filters, badges, and the map — no mocking required.
 */

import { describe, it, expect } from 'vitest'
import {
  CATEGORIES,
  DOMAINS,
  MICRO_LOCATIONS,
  CATEGORY_STYLES,
  MADURAI_CENTER,
  MADURAI_ZOOM,
} from '../constants.js'

// The exact DB CHECK constraint values from design.md §3.2
const DB_CATEGORY_VALUES = [
  'hackathon',
  'symposium',
  'bootcamp',
  'meetup',
  'workshop',
  'community',
]

// The exact micro-locations required by FR-02
const REQUIRED_MICRO_LOCATIONS = [
  'Anna Nagar',
  'KK Nagar',
  'Tallakulam',
  'Madurai South',
  'Pasumalai',
  'Othakadai',
  'Usilampatti',
]

// ---------------------------------------------------------------------------
// P4 — FR-02: Every CATEGORIES entry has non-empty value and label
// ---------------------------------------------------------------------------
describe('P4 [FR-02] CATEGORIES — every entry has non-empty value and label', () => {
  it('CATEGORIES is a non-empty array', () => {
    expect(Array.isArray(CATEGORIES)).toBe(true)
    expect(CATEGORIES.length).toBeGreaterThan(0)
  })

  CATEGORIES.forEach((cat, i) => {
    it(`CATEGORIES[${i}] ("${cat.value}") has non-empty value and label`, () => {
      expect(typeof cat.value).toBe('string')
      expect(cat.value.trim().length).toBeGreaterThan(0)
      expect(typeof cat.label).toBe('string')
      expect(cat.label.trim().length).toBeGreaterThan(0)
    })
  })
})

// ---------------------------------------------------------------------------
// P5 — FR-02: Every CATEGORIES value matches the DB CHECK constraint set exactly
// ---------------------------------------------------------------------------
describe('P5 [FR-02] CATEGORIES values match DB CHECK constraint set', () => {
  it('CATEGORIES contains exactly the 6 DB-constrained values', () => {
    const values = CATEGORIES.map(c => c.value)
    DB_CATEGORY_VALUES.forEach(expected => {
      expect(values).toContain(expected)
    })
    expect(values.length).toBe(DB_CATEGORY_VALUES.length)
  })

  CATEGORIES.forEach(cat => {
    it(`"${cat.value}" is an allowed DB category value`, () => {
      expect(DB_CATEGORY_VALUES).toContain(cat.value)
    })
  })
})

// ---------------------------------------------------------------------------
// P6 — FR-02: Every DOMAINS entry has non-empty value and label
// ---------------------------------------------------------------------------
describe('P6 [FR-02] DOMAINS — every entry has non-empty value and label', () => {
  it('DOMAINS is a non-empty array', () => {
    expect(Array.isArray(DOMAINS)).toBe(true)
    expect(DOMAINS.length).toBeGreaterThan(0)
  })

  DOMAINS.forEach((domain, i) => {
    it(`DOMAINS[${i}] ("${domain.value}") has non-empty value and label`, () => {
      expect(typeof domain.value).toBe('string')
      expect(domain.value.trim().length).toBeGreaterThan(0)
      expect(typeof domain.label).toBe('string')
      expect(domain.label.trim().length).toBeGreaterThan(0)
    })
  })
})

// ---------------------------------------------------------------------------
// P7 — FR-02: Every MICRO_LOCATIONS entry has non-empty value and label
// ---------------------------------------------------------------------------
describe('P7 [FR-02] MICRO_LOCATIONS — every entry has non-empty value and label', () => {
  it('MICRO_LOCATIONS is a non-empty array', () => {
    expect(Array.isArray(MICRO_LOCATIONS)).toBe(true)
    expect(MICRO_LOCATIONS.length).toBeGreaterThan(0)
  })

  MICRO_LOCATIONS.forEach((loc, i) => {
    it(`MICRO_LOCATIONS[${i}] ("${loc.value}") has non-empty value and label`, () => {
      expect(typeof loc.value).toBe('string')
      expect(loc.value.trim().length).toBeGreaterThan(0)
      expect(typeof loc.label).toBe('string')
      expect(loc.label.trim().length).toBeGreaterThan(0)
    })
  })
})

// ---------------------------------------------------------------------------
// P8 — FR-02: MICRO_LOCATIONS contains all 7 required Madurai areas
// ---------------------------------------------------------------------------
describe('P8 [FR-02] MICRO_LOCATIONS contains all required Madurai areas', () => {
  const locationValues = MICRO_LOCATIONS.map(l => l.value)

  REQUIRED_MICRO_LOCATIONS.forEach(required => {
    it(`MICRO_LOCATIONS contains "${required}"`, () => {
      expect(locationValues).toContain(required)
    })
  })
})

// ---------------------------------------------------------------------------
// P18 — FR-03: MADURAI_CENTER is [9.9252, 78.1198] (spec-mandated map center)
// ---------------------------------------------------------------------------
describe('P18 [FR-03] MADURAI_CENTER — correct coordinates for Madurai city', () => {
  it('MADURAI_CENTER is a 2-element array', () => {
    expect(Array.isArray(MADURAI_CENTER)).toBe(true)
    expect(MADURAI_CENTER.length).toBe(2)
  })

  it('MADURAI_CENTER latitude is 9.9252', () => {
    expect(MADURAI_CENTER[0]).toBe(9.9252)
  })

  it('MADURAI_CENTER longitude is 78.1198', () => {
    expect(MADURAI_CENTER[1]).toBe(78.1198)
  })
})

// ---------------------------------------------------------------------------
// P19 — FR-03: MADURAI_ZOOM equals 12
// ---------------------------------------------------------------------------
describe('P19 [FR-03] MADURAI_ZOOM — default zoom level is 12', () => {
  it('MADURAI_ZOOM === 12', () => {
    expect(MADURAI_ZOOM).toBe(12)
  })
})

// ---------------------------------------------------------------------------
// P20 — FR-02 / design.md §7: CATEGORY_STYLES has an entry for every
// CATEGORIES value — no category can render without a style
// ---------------------------------------------------------------------------
describe('P20 [FR-02] CATEGORY_STYLES — entry exists for every CATEGORIES value', () => {
  CATEGORIES.forEach(cat => {
    it(`CATEGORY_STYLES has entry for "${cat.value}"`, () => {
      const style = CATEGORY_STYLES[cat.value]
      expect(style).toBeDefined()
      expect(typeof style.bg).toBe('string')
      expect(style.bg.trim().length).toBeGreaterThan(0)
      expect(typeof style.text).toBe('string')
      expect(style.text.trim().length).toBeGreaterThan(0)
      expect(typeof style.dot).toBe('string')
      expect(style.dot.trim().length).toBeGreaterThan(0)
    })
  })
})

// ---------------------------------------------------------------------------
// Structural: no duplicate values in CATEGORIES, DOMAINS, MICRO_LOCATIONS
// Duplicate values would cause React key collisions and broken filter logic
// ---------------------------------------------------------------------------
describe('[FR-02] No duplicate values in filter constant arrays', () => {
  it('CATEGORIES has no duplicate values', () => {
    const values = CATEGORIES.map(c => c.value)
    expect(new Set(values).size).toBe(values.length)
  })

  it('DOMAINS has no duplicate values', () => {
    const values = DOMAINS.map(d => d.value)
    expect(new Set(values).size).toBe(values.length)
  })

  it('MICRO_LOCATIONS has no duplicate values', () => {
    const values = MICRO_LOCATIONS.map(l => l.value)
    expect(new Set(values).size).toBe(values.length)
  })
})
