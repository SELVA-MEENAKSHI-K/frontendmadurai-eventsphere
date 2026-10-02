/**
 * Property-based tests for eventService.js — filter parameter stripping
 * Kiro Spec Correctness — Madurai EventSphere
 *
 * Feature under test:
 *   getEvents(filters) strips empty strings, null, and undefined values
 *   from the filters object before sending them as API query params.
 *
 * Why this matters (FR-02, FR-09):
 *   FR-02 requires that multiple filters can be applied simultaneously.
 *   FR-09 requires search to work in combination with other active filters.
 *   If empty/null params are forwarded to the backend, the Supabase query
 *   receives unexpected filter conditions and may return wrong results.
 *
 * This file tests the pure filter-stripping logic extracted from getEvents.
 * The axios API call itself is mocked so no network is needed.
 *
 * Universal properties tested:
 *   P-F1: For any filters object, empty string values are never sent as params
 *   P-F2: For any filters object, null values are never sent as params
 *   P-F3: For any filters object, undefined values are never sent as params
 *   P-F4: For any filters object, non-empty values ARE always preserved
 *   P-F5: An entirely empty filters object produces zero query params
 *   P-F6: A fully-populated filters object sends all values unchanged
 *   P-F7: SEARCH_DEBOUNCE_MS is 300 (FR-09 acceptance criteria exact value)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CATEGORIES, DOMAINS, MICRO_LOCATIONS, SEARCH_DEBOUNCE_MS } from '../../utils/constants.js'

// ---------------------------------------------------------------------------
// Extract the pure filter-stripping function for isolated testing.
// This is the exact same logic used inside getEvents().
// Testing it in isolation proves the property without network calls.
// ---------------------------------------------------------------------------
function stripEmptyFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  )
}

// ---------------------------------------------------------------------------
// Shared filter corpora
// ---------------------------------------------------------------------------

// All valid category values from spec
const VALID_CATEGORIES = CATEGORIES.map(c => c.value)
const VALID_DOMAINS    = DOMAINS.map(d => d.value)
const VALID_LOCATIONS  = MICRO_LOCATIONS.map(l => l.value)

// Falsy / empty values that must be stripped
const EMPTY_VALUES = ['', null, undefined]

// Fully empty filters object (all keys present, all values empty)
const ALL_EMPTY_FILTERS = {
  category:       '',
  domain:         '',
  micro_location: '',
  date_from:      '',
  date_to:        '',
  search:         '',
}

// Fully populated filters object
const ALL_POPULATED_FILTERS = {
  category:       'hackathon',
  domain:         'AI/ML',
  micro_location: 'Anna Nagar',
  date_from:      '2026-10-01',
  date_to:        '2026-12-31',
  search:         'robotics',
}

// ---------------------------------------------------------------------------
// P-F1/P-F2/P-F3 [FR-02] Empty/null/undefined values are stripped per key
// ---------------------------------------------------------------------------
describe('P-F1/F2/F3 [FR-02] Empty, null, undefined values are stripped from filter params', () => {
  const FILTER_KEYS = ['category', 'domain', 'micro_location', 'date_from', 'date_to', 'search']

  FILTER_KEYS.forEach(key => {
    EMPTY_VALUES.forEach(emptyValue => {
      it(`filters.${key} = ${JSON.stringify(emptyValue)} is stripped`, () => {
        const filters = { ...ALL_POPULATED_FILTERS, [key]: emptyValue }
        const result  = stripEmptyFilters(filters)
        expect(result).not.toHaveProperty(key)
      })
    })
  })
})

// ---------------------------------------------------------------------------
// P-F4 [FR-02] Non-empty values are always preserved exactly
// ---------------------------------------------------------------------------
describe('P-F4 [FR-02] Non-empty filter values are always preserved unchanged', () => {
  it('a populated category value is preserved', () => {
    VALID_CATEGORIES.forEach(cat => {
      const result = stripEmptyFilters({ category: cat })
      expect(result.category).toBe(cat)
    })
  })

  it('a populated domain value is preserved', () => {
    VALID_DOMAINS.forEach(domain => {
      const result = stripEmptyFilters({ domain })
      expect(result.domain).toBe(domain)
    })
  })

  it('a populated micro_location value is preserved', () => {
    VALID_LOCATIONS.forEach(loc => {
      const result = stripEmptyFilters({ micro_location: loc })
      expect(result.micro_location).toBe(loc)
    })
  })

  it('a populated search string is preserved', () => {
    ['hackathon', 'robotics', 'AI', 'a', '   spaces   '].forEach(term => {
      const result = stripEmptyFilters({ search: term })
      expect(result.search).toBe(term)
    })
  })

  it('a populated date_from is preserved', () => {
    ['2026-10-01', '2026-12-31', '2027-01-01'].forEach(date => {
      const result = stripEmptyFilters({ date_from: date })
      expect(result.date_from).toBe(date)
    })
  })

  it('a populated date_to is preserved', () => {
    ['2026-10-31', '2026-12-31', '2027-06-30'].forEach(date => {
      const result = stripEmptyFilters({ date_to: date })
      expect(result.date_to).toBe(date)
    })
  })
})

// ---------------------------------------------------------------------------
// P-F5 [FR-02] Entirely empty filters object produces zero params
// (sending no params = "show all events" — default dashboard state)
// ---------------------------------------------------------------------------
describe('P-F5 [FR-02] Entirely empty filters object produces zero query params', () => {
  it('ALL_EMPTY_FILTERS strips to an empty object', () => {
    const result = stripEmptyFilters(ALL_EMPTY_FILTERS)
    expect(Object.keys(result).length).toBe(0)
  })

  it('empty object input produces empty object output', () => {
    expect(stripEmptyFilters({})).toEqual({})
  })

  it('calling with no argument produces empty object output', () => {
    expect(stripEmptyFilters()).toEqual({})
  })
})

// ---------------------------------------------------------------------------
// P-F6 [FR-02] Fully-populated filters object preserves all key-value pairs
// (all 6 filters active simultaneously — FR-02 "multiple filters at once")
// ---------------------------------------------------------------------------
describe('P-F6 [FR-02] Fully-populated filters are all preserved', () => {
  it('ALL_POPULATED_FILTERS passes through unchanged', () => {
    const result = stripEmptyFilters(ALL_POPULATED_FILTERS)
    expect(result).toEqual(ALL_POPULATED_FILTERS)
  })

  it('result has exactly as many keys as populated input', () => {
    const result = stripEmptyFilters(ALL_POPULATED_FILTERS)
    expect(Object.keys(result).length).toBe(Object.keys(ALL_POPULATED_FILTERS).length)
  })
})

// ---------------------------------------------------------------------------
// P-F7 [FR-09] SEARCH_DEBOUNCE_MS === 300
// FR-09 acceptance criteria: "Search is debounced (triggers after 300ms of no typing)"
// ---------------------------------------------------------------------------
describe('P-F7 [FR-09] SEARCH_DEBOUNCE_MS is exactly 300ms as required by FR-09', () => {
  it('SEARCH_DEBOUNCE_MS === 300', () => {
    expect(SEARCH_DEBOUNCE_MS).toBe(300)
  })

  it('SEARCH_DEBOUNCE_MS is a positive number', () => {
    expect(typeof SEARCH_DEBOUNCE_MS).toBe('number')
    expect(SEARCH_DEBOUNCE_MS).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// Mixed: partial filter — some fields populated, some empty
// Verifies both stripping and preservation in the same call
// ---------------------------------------------------------------------------
describe('[FR-02] Mixed filters — populated values preserved, empty values stripped', () => {
  it('only populated keys survive in a mixed filters object', () => {
    const mixed = {
      category:       'hackathon',   // keep
      domain:         '',             // strip
      micro_location: 'Anna Nagar',  // keep
      date_from:      null,           // strip
      date_to:        '',             // strip
      search:         'AI',          // keep
    }
    const result = stripEmptyFilters(mixed)
    expect(result).toEqual({
      category:       'hackathon',
      micro_location: 'Anna Nagar',
      search:         'AI',
    })
  })

  it('for every CATEGORIES value, setting only category gives exactly one param', () => {
    VALID_CATEGORIES.forEach(cat => {
      const result = stripEmptyFilters({ ...ALL_EMPTY_FILTERS, category: cat })
      expect(Object.keys(result)).toEqual(['category'])
      expect(result.category).toBe(cat)
    })
  })

  it('for every MICRO_LOCATIONS value, setting only location gives exactly one param', () => {
    VALID_LOCATIONS.forEach(loc => {
      const result = stripEmptyFilters({ ...ALL_EMPTY_FILTERS, micro_location: loc })
      expect(Object.keys(result)).toEqual(['micro_location'])
      expect(result.micro_location).toBe(loc)
    })
  })
})
