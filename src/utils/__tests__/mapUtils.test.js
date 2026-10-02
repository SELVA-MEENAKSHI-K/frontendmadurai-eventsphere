/**
 * Property-based tests for mapUtils.js
 * Kiro Spec Correctness — Madurai EventSphere
 *
 * Properties are derived exclusively from:
 *   - FR-03: "Map markers are color-coded by event category"
 *   - design.md §7: exact hex color assignments per category
 *   - FR-03: "Each published event with valid coordinates is shown as a map pin/marker"
 *
 * getCategoryColor is a pure function — no DOM, no Leaflet globals needed.
 * createCategoryMarker calls L.divIcon; we mock Leaflet at the module level
 * so its structural output (html, iconSize, iconAnchor) can be verified without a browser.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest'

// ---------------------------------------------------------------------------
// Mock Leaflet before importing mapUtils so L.divIcon never touches the DOM
// ---------------------------------------------------------------------------
vi.mock('leaflet', () => ({
  default: {
    divIcon: vi.fn(options => ({ _leafletDivIcon: true, ...options })),
  },
}))

import { getCategoryColor, createCategoryMarker } from '../mapUtils.js'
import { CATEGORIES } from '../constants.js'

// ---------------------------------------------------------------------------
// Spec-mandated color table (design.md §7)
// ---------------------------------------------------------------------------
const SPEC_COLORS = {
  hackathon: '#EF4444',
  symposium: '#3B82F6',
  bootcamp:  '#8B5CF6',
  meetup:    '#10B981',
  workshop:  '#F59E0B',
  community: '#EC4899',
}

const DEFAULT_COLOR = '#6B7280'

// All valid category values from the CATEGORIES constant
const VALID_CATEGORIES = CATEGORIES.map(c => c.value)

// Inputs that are not a known category
const UNKNOWN_CATEGORIES = [null, undefined, '', 'unknown', 'concert', 'festival', 'HACKATHON_TYPO']

// ---------------------------------------------------------------------------
// P-M1 [FR-03] getCategoryColor — every spec-mandated category returns its
// exact hex color from design.md §7
// ---------------------------------------------------------------------------
describe('P-M1 [FR-03] getCategoryColor — spec-mandated colors are exact', () => {
  Object.entries(SPEC_COLORS).forEach(([category, expectedColor]) => {
    it(`getCategoryColor("${category}") === "${expectedColor}"`, () => {
      expect(getCategoryColor(category)).toBe(expectedColor)
    })
  })
})

// ---------------------------------------------------------------------------
// P-M2 [FR-03] getCategoryColor — every CATEGORIES value returns a non-empty
// hex color string (no category is ever uncolored)
// ---------------------------------------------------------------------------
describe('P-M2 [FR-03] getCategoryColor — every CATEGORIES value returns a hex color', () => {
  VALID_CATEGORIES.forEach(category => {
    it(`getCategoryColor("${category}") is a non-empty hex color string`, () => {
      const color = getCategoryColor(category)
      expect(typeof color).toBe('string')
      expect(color.length).toBeGreaterThan(0)
      // Must be a valid CSS hex color (#RRGGBB format)
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })
})

// ---------------------------------------------------------------------------
// P-M3 [FR-03] getCategoryColor — case-insensitive: uppercase/mixed-case
// category values return the same color as lowercase
// (defensive: the backend or organizer form might send "Hackathon" not "hackathon")
// ---------------------------------------------------------------------------
describe('P-M3 [FR-03] getCategoryColor — case-insensitive input', () => {
  VALID_CATEGORIES.forEach(category => {
    const upper = category.toUpperCase()
    const title = category.charAt(0).toUpperCase() + category.slice(1)

    it(`getCategoryColor("${upper}") equals getCategoryColor("${category}")`, () => {
      expect(getCategoryColor(upper)).toBe(getCategoryColor(category))
    })

    it(`getCategoryColor("${title}") equals getCategoryColor("${category}")`, () => {
      expect(getCategoryColor(title)).toBe(getCategoryColor(category))
    })
  })
})

// ---------------------------------------------------------------------------
// P-M4 [FR-03] getCategoryColor — unknown/nullish inputs return DEFAULT_COLOR
// (a marker must always render — never throw or return empty)
// ---------------------------------------------------------------------------
describe('P-M4 [FR-03] getCategoryColor — unknown/nullish inputs return default color', () => {
  UNKNOWN_CATEGORIES.forEach(input => {
    it(`getCategoryColor(${JSON.stringify(input)}) === "${DEFAULT_COLOR}"`, () => {
      expect(getCategoryColor(input)).toBe(DEFAULT_COLOR)
    })
  })
})

// ---------------------------------------------------------------------------
// P-M5 [FR-03] getCategoryColor — return value is always a valid #RRGGBB string
// for ANY input (no exceptions, no empty string, no undefined)
// ---------------------------------------------------------------------------
describe('P-M5 [FR-03] getCategoryColor — always returns a valid #RRGGBB string', () => {
  const ALL_INPUTS = [...VALID_CATEGORIES, ...UNKNOWN_CATEGORIES]

  ALL_INPUTS.forEach(input => {
    it(`getCategoryColor(${JSON.stringify(input)}) is always a #RRGGBB string`, () => {
      const result = getCategoryColor(input)
      expect(typeof result).toBe('string')
      expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })
})

// ---------------------------------------------------------------------------
// P-M6 [FR-03] SPEC_COLORS completeness — every CATEGORIES value has a
// spec-mandated color (design.md §7 is fully covered)
// ---------------------------------------------------------------------------
describe('P-M6 [FR-03] SPEC_COLORS — every CATEGORIES value has a design.md color entry', () => {
  VALID_CATEGORIES.forEach(category => {
    it(`design.md §7 defines a color for "${category}"`, () => {
      expect(SPEC_COLORS[category]).toBeDefined()
      expect(SPEC_COLORS[category]).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })
})

// ---------------------------------------------------------------------------
// P-M7 [FR-03] createCategoryMarker — returns an object with the correct
// Leaflet DivIcon shape for every known category
// (structural contract: the map rendering pipeline always gets a usable icon)
// ---------------------------------------------------------------------------
describe('P-M7 [FR-03] createCategoryMarker — returns correct DivIcon shape', () => {
  VALID_CATEGORIES.forEach(category => {
    it(`createCategoryMarker("${category}") has correct iconSize, iconAnchor, popupAnchor`, () => {
      const icon = createCategoryMarker(category)

      // Must have html string embedding the category color
      expect(typeof icon.html).toBe('string')
      expect(icon.html.length).toBeGreaterThan(0)
      expect(icon.html).toContain(getCategoryColor(category))

      // Spec: pin is 28×36px
      expect(icon.iconSize).toEqual([28, 36])
      // Anchor at pin tip (horizontal center, bottom)
      expect(icon.iconAnchor).toEqual([14, 36])
      // Popup opens above the pin
      expect(icon.popupAnchor).toEqual([0, -36])
    })
  })
})

// ---------------------------------------------------------------------------
// P-M8 [FR-03] createCategoryMarker — SVG html always embeds a valid hex color
// (the correct category color appears in the rendered markup)
// ---------------------------------------------------------------------------
describe('P-M8 [FR-03] createCategoryMarker — SVG html embeds the correct hex color', () => {
  Object.entries(SPEC_COLORS).forEach(([category, expectedColor]) => {
    it(`createCategoryMarker("${category}") SVG contains "${expectedColor}"`, () => {
      const icon = createCategoryMarker(category)
      expect(icon.html).toContain(expectedColor)
    })
  })
})
