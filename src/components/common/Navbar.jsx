import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from './ThemeToggle'

/** Maroon Navbar logo — inline SVG pin, aria-hidden */
function LogoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.713-5.077 3.713-9.077a8 8 0 10-16 0c0 4 1.769 6.998 3.713 9.077a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
    </svg>
  )
}

const navLink = ({ isActive }) =>
  `text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2 ${
    isActive
      ? 'text-saffron-600 dark:text-saffron-400'
      : 'text-brand-600/80 hover:text-brand-600 dark:text-brand-200/80 dark:hover:text-brand-100'
  }`

const mobileNavLink = ({ isActive }) =>
  `block text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors ${
    isActive
      ? 'bg-saffron-600/10 text-saffron-600 dark:bg-saffron-400/10 dark:text-saffron-400'
      : 'text-brand-600 hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-brand-800'
  }`

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleMenu() { setMenuOpen(prev => !prev) }
  function closeMenu()  { setMenuOpen(false) }

  return (
    <>
      <header className="bg-brand-50 dark:bg-brand-950 border-b border-brand-100 dark:border-brand-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-brand-600 dark:text-brand-100 font-display font-bold text-xl hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2 rounded"
              onClick={closeMenu}
            >
              <LogoIcon />
              <span>EventSphere</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-5" aria-label="Main navigation">
              <NavLink to="/"        end className={navLink}>Home</NavLink>
              <NavLink to="/calendar"    className={navLink}>Calendar</NavLink>
              {user && <NavLink to="/profile"           className={navLink}>Profile</NavLink>}
              {user && <NavLink to="/bookmarks"         className={navLink}>Bookmarks</NavLink>}
              {user && <NavLink to="/my-registrations"  className={navLink}>Registrations</NavLink>}
              {user?.role === 'organizer' && <NavLink to="/organizer/dashboard" className={navLink}>My Events</NavLink>}
              {user?.role === 'organizer' && <NavLink to="/organizer/checkin"   className={navLink}>Check-in</NavLink>}
              {user?.role === 'organizer' && (
                <NavLink
                  to="/organizer/events/new"
                  className="text-sm font-semibold bg-saffron-600 hover:bg-saffron-500 text-white px-4 py-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
                >
                  + Post event
                </NavLink>
              )}
            </nav>

            {/* Right cluster: theme toggle + auth */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-brand-600 dark:text-brand-100 max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-brand-600/60 hover:text-red-600 dark:text-brand-300/70 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="text-sm font-semibold text-brand-600 dark:text-brand-200 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors px-3 py-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile: theme + hamburger */}
            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />
              <button
                className="p-2 rounded-lg text-brand-600 hover:bg-brand-100 dark:text-brand-200 dark:hover:bg-brand-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
                onClick={toggleMenu}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                {menuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-brand-100 dark:border-brand-800 bg-brand-50 dark:bg-brand-950 px-4 py-3 space-y-1"
          >
            <NavLink to="/"       end onClick={closeMenu} className={mobileNavLink}>Home</NavLink>
            <NavLink to="/calendar"   onClick={closeMenu} className={mobileNavLink}>Calendar</NavLink>
            {user && <NavLink to="/profile"          onClick={closeMenu} className={mobileNavLink}>Profile</NavLink>}
            {user && <NavLink to="/bookmarks"        onClick={closeMenu} className={mobileNavLink}>Bookmarks</NavLink>}
            {user && <NavLink to="/my-registrations" onClick={closeMenu} className={mobileNavLink}>Registrations</NavLink>}
            {user?.role === 'organizer' && <NavLink to="/organizer/dashboard" onClick={closeMenu} className={mobileNavLink}>My Events</NavLink>}
            {user?.role === 'organizer' && <NavLink to="/organizer/checkin"   onClick={closeMenu} className={mobileNavLink}>Check-in</NavLink>}
            {user?.role === 'organizer' && (
              <NavLink to="/organizer/events/new" onClick={closeMenu} className="block text-sm font-semibold py-2.5 px-3 rounded-xl text-saffron-600 dark:text-saffron-400 hover:bg-saffron-600/10 transition-colors">
                + Post event
              </NavLink>
            )}
            <div className="pt-2 border-t border-brand-100 dark:border-brand-800 mt-2">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-semibold text-brand-600 dark:text-brand-100 truncate max-w-[180px]">{user.full_name}</span>
                  <button
                    onClick={() => { logout(); closeMenu() }}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 px-3 py-2">
                  <NavLink to="/login"    onClick={closeMenu} className="text-sm font-semibold text-brand-600 dark:text-brand-200 hover:text-saffron-600 transition-colors">Login</NavLink>
                  <NavLink to="/register" onClick={closeMenu} className="text-sm font-semibold bg-brand-600 text-white px-4 py-1.5 rounded-full hover:bg-brand-700 transition-colors">Register</NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
