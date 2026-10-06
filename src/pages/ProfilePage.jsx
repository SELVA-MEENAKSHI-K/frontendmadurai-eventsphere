import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import useBookmarks from '../hooks/useBookmarks'
import { getDemoRegistrations, getDemoCheckins } from '../utils/demoCheckin'
import { getInitials, profileCompleteness, countCheckedIn } from '../utils/profileUtils'

const NAME_MAX = 100
const COLLEGE_MAX = 120

const COLLEGE_SUGGESTIONS = [
  'Thiagarajar College of Engineering',
  'The American College',
  'Lady Doak College',
  'Fatima College',
  'Madurai Kamaraj University',
  'Meenakshi Government Arts College',
]

const ROLE_INFO = {
  student:   { label: 'Student',   blurb: 'Discover events, save favourites and register.' },
  organizer: { label: 'Organizer', blurb: 'Publish events and manage check-ins.' },
}

const inputClass = hasError =>
  `w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-100 placeholder:text-brand-600/30 dark:placeholder:text-brand-500 focus:outline-none focus:ring-2 focus:ring-saffron-600 focus:border-transparent transition-colors ${
    hasError ? 'border-red-400' : 'border-brand-200 dark:border-brand-700'
  }`

const labelClass = 'block text-xs font-semibold text-brand-600/60 dark:text-brand-300 uppercase tracking-wide mb-1.5'

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const { bookmarkedIds } = useBookmarks()

  const [fullName, setFullName] = useState(user?.full_name ?? '')
  const [college, setCollege]   = useState(user?.college ?? '')
  const [saving, setSaving]     = useState(false)
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    setFullName(user?.full_name ?? '')
    setCollege(user?.college ?? '')
  }, [user?.full_name, user?.college])

  const isDemo      = Boolean(user?.isDemo)
  const isOrganizer = user?.role === 'organizer'
  const role        = ROLE_INFO[user?.role] ?? { label: user?.role ?? 'Member', blurb: '' }

  // Demo registrations live in this browser only
  const { registrations, checkedIn } = useMemo(() => {
    if (!isDemo) return { registrations: [], checkedIn: 0 }
    const regs = getDemoRegistrations()
    return { registrations: regs, checkedIn: countCheckedIn(regs, getDemoCheckins()) }
  }, [isDemo])

  const isDirty =
    fullName.trim() !== (user?.full_name ?? '').trim() ||
    college.trim()  !== (user?.college ?? '').trim()

  const completeness = profileCompleteness({ fullName: user?.full_name, college: user?.college, isDemo })
  const initials = getInitials(user?.full_name || user?.email)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!fullName.trim()) {
      setNameError('Please enter your name.')
      document.getElementById('profile-full-name')?.focus()
      return
    }
    setNameError('')
    setSaving(true)
    try {
      await updateProfile({ full_name: fullName, college })
      toast.success('Profile updated.')
    } catch (error) {
      toast.error(error.message || 'Could not update your profile.')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setFullName(user?.full_name ?? '')
    setCollege(user?.college ?? '')
    setNameError('')
  }

  const stats = [
    { label: 'Saved events', value: bookmarkedIds.size, to: '/bookmarks' },
    ...(isDemo ? [
      { label: 'Registrations', value: registrations.length, to: '/my-registrations' },
      { label: 'Checked in',    value: checkedIn,            to: '/my-registrations' },
    ] : []),
  ]

  const quickLinks = isOrganizer
    ? [
        { to: '/organizer/dashboard',  icon: '🗂️', title: 'My events',  desc: 'Manage what you have published' },
        { to: '/organizer/events/new', icon: '➕', title: 'Post an event', desc: 'Create a new event' },
        { to: '/organizer/checkin',    icon: '📲', title: 'Check-in desk', desc: 'Scan attendee QR codes' },
      ]
    : [
        { to: '/',                  icon: '🔎', title: 'Browse events', desc: 'Find something near you' },
        { to: '/bookmarks',         icon: '🔖', title: 'Bookmarks',     desc: 'Events you saved' },
        { to: '/my-registrations',  icon: '🎟️', title: 'Registrations', desc: 'Your QR codes' },
      ]

  return (
    <>
      <Helmet>
        <title>My Profile — Madurai EventSphere</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isDemo && (
          <div role="status" className="mb-5 rounded-2xl border border-teal-200 dark:border-teal-500/30 bg-teal-100/60 dark:bg-brand-900 px-4 py-3 text-sm text-teal-700 dark:text-teal-300">
            Demo profile — changes are saved only in this browser.
          </div>
        )}

        {/* ── Header card ─────────────────────────────────────────── */}
        <section className="bg-white dark:bg-brand-900 rounded-3xl border border-brand-100 dark:border-brand-800 shadow-card overflow-hidden mb-6">
          <div className="h-28 sm:h-32 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 relative" aria-hidden="true">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-300/20 blur-2xl" />
            <div className="absolute left-1/3 -bottom-16 h-40 w-40 rounded-full bg-saffron-400/20 blur-2xl" />
          </div>

          <div className="px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
              <div
                className="h-20 w-20 rounded-full bg-gradient-to-br from-saffron-600 to-gold-500 text-white flex items-center justify-center text-2xl font-bold ring-4 ring-white dark:ring-brand-900 shadow-sm flex-shrink-0"
                role="img"
                aria-label={`Avatar for ${user?.full_name ?? 'you'}`}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-600 dark:text-brand-50 truncate">
                  {user?.full_name}
                </h1>
                <p className="text-sm text-brand-600/60 dark:text-brand-300 truncate">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-saffron-600 text-white px-2.5 py-1 text-xs font-semibold">
                    {role.label}
                  </span>
                  {isDemo && (
                    <span className="inline-flex items-center rounded-full bg-gold-300/40 dark:bg-gold-300/20 text-brand-700 dark:text-gold-300 px-2.5 py-1 text-xs font-semibold">
                      Demo account
                    </span>
                  )}
                  {user?.college && (
                    <span className="text-xs text-brand-600/60 dark:text-brand-300 truncate">🎓 {user.college}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="self-start sm:self-end rounded-xl border border-brand-200 dark:border-brand-700 px-4 py-2 text-sm font-semibold text-brand-600 dark:text-brand-200 hover:border-saffron-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Stats */}
          <ul className={`grid divide-x divide-brand-100 dark:divide-brand-800 border-t border-brand-100 dark:border-brand-800 ${stats.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {stats.map(s => (
              <li key={s.label}>
                <Link to={s.to} className="block text-center py-4 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron-600">
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-50">{s.value}</p>
                  <p className="text-xs text-brand-600/60 dark:text-brand-300">{s.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Edit form ─────────────────────────────────────────── */}
          <section className="lg:col-span-2 bg-white dark:bg-brand-900 rounded-3xl border border-brand-100 dark:border-brand-800 shadow-card p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-brand-600 dark:text-brand-50 mb-1">Profile details</h2>
            <p className="text-sm text-brand-600/60 dark:text-brand-300 mb-6">Update how you appear on EventSphere.</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="profile-full-name" className={labelClass}>Full name</label>
                <input
                  id="profile-full-name"
                  type="text"
                  value={fullName}
                  onChange={e => { setFullName(e.target.value); if (nameError) setNameError('') }}
                  autoComplete="name"
                  required
                  maxLength={NAME_MAX}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? 'profile-name-error' : undefined}
                  className={inputClass(nameError)}
                />
                <div className="flex justify-between mt-1">
                  <p id="profile-name-error" role="alert" className="text-xs text-red-600 dark:text-red-400">{nameError}</p>
                  <p className="text-xs text-brand-600/40 dark:text-brand-500">{fullName.length}/{NAME_MAX}</p>
                </div>
              </div>

              <div>
                <label htmlFor="profile-email" className={labelClass}>Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={user?.email ?? ''}
                  readOnly
                  className="w-full border border-brand-100 dark:border-brand-800 rounded-xl px-4 py-2.5 text-sm bg-brand-50 dark:bg-brand-950 text-brand-600/60 dark:text-brand-400 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-brand-600/40 dark:text-brand-500">Email address cannot be changed here.</p>
              </div>

              <div>
                <label htmlFor="profile-college" className={labelClass}>College</label>
                <input
                  id="profile-college"
                  type="text"
                  list="college-suggestions"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  autoComplete="organization"
                  maxLength={COLLEGE_MAX}
                  placeholder="Your college (optional)"
                  className={inputClass(false)}
                />
                <datalist id="college-suggestions">
                  {COLLEGE_SUGGESTIONS.map(c => <option key={c} value={c} />)}
                </datalist>
                <p className="mt-1 text-xs text-brand-600/40 dark:text-brand-500">Pick a suggestion or type your own.</p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!isDirty || saving}
                  className="rounded-2xl border border-brand-200 dark:border-brand-700 px-5 py-2.5 text-sm font-semibold text-brand-600 dark:text-brand-200 hover:border-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={!isDirty || saving}
                  className="rounded-2xl bg-saffron-600 hover:bg-saffron-500 disabled:bg-saffron-300 disabled:cursor-not-allowed px-6 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
                >
                  {saving ? 'Saving…' : 'Save profile'}
                </button>
              </div>
            </form>
          </section>

          {/* ── Sidebar ───────────────────────────────────────────── */}
          <aside className="space-y-6">
            <section className="bg-white dark:bg-brand-900 rounded-3xl border border-brand-100 dark:border-brand-800 shadow-card p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-base font-bold text-brand-600 dark:text-brand-50">Profile strength</h2>
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{completeness.percent}%</span>
              </div>
              <div
                className="h-2 rounded-full bg-brand-100 dark:bg-brand-800 overflow-hidden"
                role="progressbar"
                aria-valuenow={completeness.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Profile completeness"
              >
                <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${completeness.percent}%` }} />
              </div>
              {completeness.missing.length > 0 ? (
                <ul className="mt-3 space-y-1 text-xs text-brand-600/70 dark:text-brand-300">
                  {completeness.missing.map(m => <li key={m}>○ {m}</li>)}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-teal-600 dark:text-teal-400 font-medium">✓ Your profile is complete.</p>
              )}
              <p className="mt-4 text-xs text-brand-600/50 dark:text-brand-400">{role.blurb}</p>
            </section>

            <section className="bg-white dark:bg-brand-900 rounded-3xl border border-brand-100 dark:border-brand-800 shadow-card p-3">
              <h2 className="sr-only">Quick links</h2>
              <ul>
                {quickLinks.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600">
                      <span className="text-xl" aria-hidden="true">{l.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-brand-600 dark:text-brand-100">{l.title}</span>
                        <span className="block text-xs text-brand-600/60 dark:text-brand-300 truncate">{l.desc}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}
