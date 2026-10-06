import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, loginAsDemo } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const from = location.state?.from?.pathname ?? '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDemoLogin() {
    setError(null)
    loginAsDemo()
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-[80vh] flex items-stretch">

      {/* ── Left panel — maroon brand + copy ─────────────────────────────────
          White text on maroon = 9.1:1 ✅. saffron-400 headline at display
          size = large text 3.1:1 ✅.                                         */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-brand-600 dark:bg-brand-800 flex-col justify-between p-12 text-white"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(253,246,236,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        aria-hidden="true"
      >
        <div>
          <div className="flex items-center gap-2 mb-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.713-5.077 3.713-9.077a8 8 0 10-16 0c0 4 1.769 6.998 3.713 9.077a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z" clipRule="evenodd" />
            </svg>
            <span className="font-display font-bold text-xl">EventSphere</span>
          </div>
          <h2 className="font-display text-4xl font-bold leading-snug mb-4">
            Madurai&apos;s home for <span className="text-saffron-400">student events</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Hackathons, symposiums, bootcamps and meetups — discover, register, and connect with the local tech community.
          </p>
        </div>

        {/* Decorative gopuram dots */}
        <p className="text-white/30 text-xs">
          📍 Madurai · students · founders · makers
        </p>
      </div>

      {/* ── Right panel — form ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-brand-50 dark:bg-brand-950">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-brand-600 dark:text-brand-50 mb-1">Welcome back</h1>
            <p className="text-sm text-brand-600/60 dark:text-brand-300">Sign in to your EventSphere account</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-brand-900 rounded-3xl border border-brand-100 dark:border-brand-800 shadow-card p-8 space-y-5"
            noValidate
          >
            {error && (
              <div role="alert" className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-brand-600/60 dark:text-brand-300 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full border border-brand-200 dark:border-brand-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-100 placeholder:text-brand-600/30 dark:placeholder:text-brand-500 focus:outline-none focus:ring-2 focus:ring-saffron-600 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-brand-600/60 dark:text-brand-300 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border border-brand-200 dark:border-brand-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-100 placeholder:text-brand-600/30 dark:placeholder:text-brand-500 focus:outline-none focus:ring-2 focus:ring-saffron-600 focus:border-transparent transition-colors"
              />
            </div>

            {/* white on saffron-600 (#B84D00) = 5.12:1 ✅ */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-saffron-600 hover:bg-saffron-500 disabled:bg-saffron-300 text-white font-semibold py-3 rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-brand-600/60 dark:text-brand-300">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-saffron-600 dark:text-saffron-400 hover:underline">
                Register
              </Link>
            </p>

            {/* Demo mode divider */}
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-brand-100 dark:bg-brand-800" />
              <span className="text-xs text-brand-600/40 dark:text-brand-500 font-medium">or</span>
              <span className="h-px flex-1 bg-brand-100 dark:bg-brand-800" />
            </div>

            {/* Demo login — brand-600 on brand-100 bg = 11.8:1 ✅ */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full border-2 border-brand-200 dark:border-brand-700 hover:border-saffron-600 dark:hover:border-saffron-400 bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-200 font-semibold py-3 rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
            >
              Try Demo Mode
            </button>
            <p className="text-center text-xs text-brand-600/40 dark:text-brand-500 -mt-2">
              Explore without an account · no sign-up required
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
