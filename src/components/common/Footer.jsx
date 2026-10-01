import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.713-5.077 3.713-9.077a8 8 0 10-16 0c0 4 1.769 6.998 3.713 9.077a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
            </svg>
            <span>EventSphere</span>
          </div>
          <p className="text-sm text-gray-500 text-center">Madurai EventSphere &middot; Kiro University Challenge 2026</p>
          <nav className="flex items-center gap-4" aria-label="Footer navigation">
            <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Discover</Link>
            <Link to="/login" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Login</Link>
            <Link to="/register" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Register</Link>
          </nav>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">&copy; {new Date().getFullYear()} Madurai EventSphere. Built for the Kiro University Challenge.</p>
      </div>
    </footer>
  )
}
