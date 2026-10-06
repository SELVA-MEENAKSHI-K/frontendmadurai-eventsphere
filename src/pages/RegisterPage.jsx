import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register, loginAsDemo } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'student', college: '' })
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      await register({ email: form.email, password: form.password, full_name: form.full_name, role: form.role, college: form.college || null })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDemoLogin() {
    setError(null)
    loginAsDemo()
    navigate('/', { replace: true })
  }

  const inputCls = 'w-full border border-brand-200 dark:border-brand-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-100 placeholder:text-brand-600/30 dark:placeholder:text-brand-500 focus:outline-none focus:ring-2 focus:ring-saffron-600 focus:border-transparent transition-colors'
  const labelCls = 'block text-xs font-semibold text-brand-600/60 dark:text-brand-300 uppercase tracking-wide mb-1.5'

  return (
    <div className="min-h-[80vh] flex items-stretch">

      {/* ── Left brand panel ─────────────────────────────────────────────────
          White text on maroon = 9.1:1 ✅.                                   */}
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
            Join Madurai&apos;s <span className="text-saffron-400">event community</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Create an account to bookmark events, register for demos, and — if you&apos;re an organiser — post your own events to the city.
          </p>
        </div>
        <p className="text-white/30 text-xs">📍 Madurai · students · founders · makers</p>
      </div>

      {/* ── Form panel ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-brand-50 dark:bg-brand-950">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-brand-600 dark:text-brand-50 mb-1">Create an account</h1>
            <p className="text-sm text-brand-600/60 dark:text-brand-300">Join EventSphere to discover and organise events</p>
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
              <label htmlFor="full_name" className={labelCls}>Full name</label>
              <input id="full_name" name="full_name" type="text" value={form.full_name} onChange={handleChange} required autoComplete="name" placeholder="Selva Meenakshi" className={inputCls} />
            </div>

            <div>
              <label htmlFor="email" className={labelCls}>Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" placeholder="you@example.com" className={inputCls} />
            </div>

            <div>
              <label htmlFor="password" className={labelCls}>
                Password <span className="normal-case font-normal text-brand-600/40 dark:text-brand-400">(min 8 characters)</span>
              </label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} autoComplete="new-password" placeholder="••••••••" className={inputCls} />
            </div>

            {/* Role selector */}
            <fieldset>
              <legend className={labelCls}>I am a…</legend>
              <div className="flex gap-3">
                {[{ value: 'student', label: 'Student' }, { value: 'organizer', label: 'Organizer' }].map(({ value, label }) => (
                  <label
                    key={value}
                    className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-semibold cursor-pointer transition-colors ${
                      form.role === value
                        ? 'bg-saffron-600 border-saffron-600 text-white'
                        : 'border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-200 hover:border-saffron-600 dark:hover:border-saffron-400 bg-white dark:bg-brand-900'
                    }`}
                  >
                    <input type="radio" name="role" value={value} checked={form.role === value} onChange={handleChange} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="college" className={labelCls}>
                College <span className="normal-case font-normal text-brand-600/40 dark:text-brand-400">(optional)</span>
              </label>
              <input id="college" name="college" type="text" value={form.college} onChange={handleChange} autoComplete="organization" placeholder="Thiagarajar College of Engineering" className={inputCls} />
            </div>

            {/* white on saffron-600 = 5.12:1 ✅ */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-saffron-600 hover:bg-saffron-500 disabled:bg-saffron-300 text-white font-semibold py-3 rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600 focus-visible:ring-offset-2"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-center text-sm text-brand-600/60 dark:text-brand-300">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-saffron-600 dark:text-saffron-400 hover:underline">
                Sign in
              </Link>
            </p>

            {/* Demo mode divider */}
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-brand-100 dark:bg-brand-800" />
              <span className="text-xs text-brand-600/40 dark:text-brand-500 font-medium">or</span>
              <span className="h-px flex-1 bg-brand-100 dark:bg-brand-800" />
            </div>

            {/* Demo login — brand-600 on white = 11.8:1 ✅ */}
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
