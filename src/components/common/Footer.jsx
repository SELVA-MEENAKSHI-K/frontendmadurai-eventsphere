import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-brand-600 dark:bg-brand-950 text-white mt-auto">
      {/* Kolam-dot watermark — decorative, aria-hidden */}
      <div
        className="bg-kolam-dots bg-kolam opacity-100"
        aria-hidden="true"
        style={{ backgroundSize: '20px 20px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            {/* Brand */}
            <div>
              <Link
                to="/"
                className="flex items-center gap-2 font-display font-bold text-xl text-white hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600 rounded"
              >
                {/* Location pin icon — white on maroon = 9.1:1 ✅ */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.713-5.077 3.713-9.077a8 8 0 10-16 0c0 4 1.769 6.998 3.713 9.077a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
                </svg>
                EventSphere
              </Link>
              <p className="text-sm text-white/70 mt-1 max-w-xs">
                Discover hackathons, symposiums, bootcamps and meetups across Madurai.
              </p>
            </div>

            {/* Nav links — white on maroon 9.1:1 ✅ */}
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { to: '/',        label: 'Home' },
                { to: '/calendar',label: 'Calendar' },
                { to: '/login',   label: 'Login' },
                { to: '/register',label: 'Register' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600 rounded"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom rule */}
          <div className="mt-8 pt-6 border-t border-white/15 text-center">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} Madurai EventSphere · Kiro University Challenge 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
