import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Mobile-only bottom navigation bar (hidden on md+).
 * Shows the 5 most common destinations.
 * All interactive elements are ≥44px tall.
 * Icon + label contrast: brand-600 on brand-50 = 11.8:1 ✅ (light)
 *                        brand-200 on brand-950 = ~10:1 ✅ (dark)
 * Active: saffron-600 on brand-50 = 4.77:1 ✅ (light, normal text)
 */
export default function BottomNav() {
  const { user } = useAuth()

  const base =
    'flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[44px] pt-2 pb-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-1'
  const active   = 'text-saffron-600 dark:text-saffron-400'
  const inactive = 'text-brand-600/60 dark:text-brand-300/60 hover:text-brand-600 dark:hover:text-brand-200'

  function cls({ isActive }) {
    return `${base} ${isActive ? active : inactive}`
  }

  return (
    <nav
      aria-label="Bottom navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-50 dark:bg-brand-950 border-t border-brand-100 dark:border-brand-800 flex safe-area-inset-bottom shadow-[0_-1px_4px_rgba(26,15,10,0.07)]"
    >
      <NavLink to="/" end className={cls}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Home
      </NavLink>

      <NavLink to="/calendar" className={cls}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Calendar
      </NavLink>

      {user ? (
        <NavLink to="/bookmarks" className={cls}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Saved
        </NavLink>
      ) : (
        <NavLink to="/login" className={cls}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Login
        </NavLink>
      )}

      {user ? (
        <NavLink to="/my-registrations" className={cls}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Tickets
        </NavLink>
      ) : (
        <NavLink to="/register" className={cls}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Join
        </NavLink>
      )}

      <NavLink to={user ? '/profile' : '/login'} className={cls}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {user ? 'Profile' : 'Account'}
      </NavLink>
    </nav>
  )
}
