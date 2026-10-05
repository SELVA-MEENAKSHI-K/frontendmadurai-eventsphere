import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleMenu() { setMenuOpen(prev => !prev) }
  function closeMenu()  { setMenuOpen(false) }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl" onClick={closeMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.713-5.077 3.713-9.077a8 8 0 10-16 0c0 4 1.769 6.998 3.713 9.077a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
            </svg>
            <span>EventSphere</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <NavLink to="/" end className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Home</NavLink>
            {user && <NavLink to="/profile" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Profile</NavLink>}
            {user && <NavLink to="/bookmarks" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Bookmarks</NavLink>}
            {user && <NavLink to="/my-registrations" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>My Registrations</NavLink>}
            {user?.role === 'organizer' && <NavLink to="/organizer/dashboard" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>My Events</NavLink>}
            {user?.role === 'organizer' && <NavLink to="/organizer/checkin" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Check-in</NavLink>}
            {user?.role === 'organizer' && <NavLink to="/organizer/events/new" className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">+ Post event</NavLink>}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 font-medium">{user.full_name}</span>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600 transition-colors">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Login</NavLink>
                <NavLink to="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors">Register</NavLink>
              </div>
            )}
          </nav>

          <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors" onClick={toggleMenu} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            {menuOpen
              ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => `block text-sm font-medium py-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>Home</NavLink>
          {user && <NavLink to="/profile" onClick={closeMenu} className={({ isActive }) => `block text-sm font-medium py-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>Profile</NavLink>}
          {user && <NavLink to="/bookmarks" onClick={closeMenu} className={({ isActive }) => `block text-sm font-medium py-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>Bookmarks</NavLink>}
          {user && <NavLink to="/my-registrations" onClick={closeMenu} className={({ isActive }) => `block text-sm font-medium py-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>My Registrations</NavLink>}
          {user?.role === 'organizer' && <NavLink to="/organizer/dashboard" onClick={closeMenu} className={({ isActive }) => `block text-sm font-medium py-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>My Events</NavLink>}
          {user?.role === 'organizer' && <NavLink to="/organizer/checkin" onClick={closeMenu} className={({ isActive }) => `block text-sm font-medium py-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>Check-in</NavLink>}
          {user?.role === 'organizer' && <NavLink to="/organizer/events/new" onClick={closeMenu} className="block text-sm font-medium py-2 text-blue-600">+ Post event</NavLink>}
          {user ? (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">{user.full_name}</p>
              <button onClick={() => { logout(); closeMenu() }} className="text-sm text-red-600 font-medium">Logout</button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex gap-4">
              <NavLink to="/login" onClick={closeMenu} className="text-sm font-medium text-gray-700">Login</NavLink>
              <NavLink to="/register" onClick={closeMenu} className="text-sm font-medium text-blue-600">Register</NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
