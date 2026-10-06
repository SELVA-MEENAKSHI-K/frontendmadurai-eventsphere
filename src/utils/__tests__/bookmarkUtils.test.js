import { describe, it, expect } from 'vitest'
import { mergeSavedEvents } from '../bookmarkUtils'

const events = [
  { id: 'a', event_date: '2026-12-01T00:00:00Z' },
  { id: 'b', event_date: '2026-11-01T00:00:00Z' },
  { id: 'c', event_date: '2026-10-20T00:00:00Z' },
  { id: 'd', event_date: null },
]

describe('mergeSavedEvents', () => {
  it('includes bookmarked events', () => {
    expect(mergeSavedEvents(events, new Set(['a']), []).map(e => e.id)).toEqual(['a'])
  })
  it('includes registered events even when not bookmarked, flagged _registered', () => {
    const out = mergeSavedEvents(events, new Set(), [{ eventId: 'b', token: 'ES-b-1' }])
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ id: 'b', _registered: true })
  })
  it('does not duplicate an event that is both bookmarked and registered', () => {
    const out = mergeSavedEvents(events, new Set(['b']), [{ eventId: 'b' }])
    expect(out.map(e => e.id)).toEqual(['b'])
    expect(out[0]._registered).toBe(true)
  })
  it('sorts by date with TBA last and does not flag plain bookmarks', () => {
    const out = mergeSavedEvents(events, new Set(['a', 'c', 'd']), [{ eventId: 'b' }])
    expect(out.map(e => e.id)).toEqual(['c', 'b', 'a', 'd'])
    expect(out.find(e => e.id === 'c')._registered).toBeUndefined()
  })
  it('ignores registrations for unknown events', () => {
    expect(mergeSavedEvents(events, new Set(), [{ eventId: 'zzz' }])).toEqual([])
  })
})
