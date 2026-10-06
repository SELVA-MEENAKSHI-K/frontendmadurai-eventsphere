import { describe, it, expect } from 'vitest'
import { getInitials, profileCompleteness, countCheckedIn } from '../profileUtils'

describe('getInitials', () => {
  it('uses the first two words of a name', () => {
    expect(getInitials('Selva Meenakshi K')).toBe('SM')
    expect(getInitials('demo')).toBe('D')
  })
  it('falls back to email parts, then U', () => {
    expect(getInitials('demo@student.eventsphere.local')).toBe('DS')
    expect(getInitials('')).toBe('U')
    expect(getInitials(null)).toBe('U')
    expect(getInitials('   ')).toBe('U')
  })
})

describe('profileCompleteness', () => {
  it('is 100% for a full real profile', () => {
    expect(profileCompleteness({ fullName: 'A', college: 'B', isDemo: false })).toEqual({ percent: 100, missing: [] })
  })
  it('lists what is missing', () => {
    const r = profileCompleteness({ fullName: 'A', college: '  ', isDemo: true })
    expect(r.percent).toBe(33)
    expect(r.missing).toEqual(['Add your college', 'Sign in with a real account'])
  })
})

describe('countCheckedIn', () => {
  it('matches tokens case-insensitively', () => {
    const regs = [{ token: 'ES-a-1234abcd' }, { token: 'ES-b-9999ffff' }]
    expect(countCheckedIn(regs, { 'ES-A-1234ABCD': { checkedInAt: 'x' } })).toBe(1)
  })
  it('handles empty input', () => {
    expect(countCheckedIn()).toBe(0)
  })
})
