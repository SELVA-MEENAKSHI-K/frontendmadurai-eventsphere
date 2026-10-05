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

  // Return to the page the user originally requested, or home
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your EventSphere account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5"
          noValidate
        >
          {error && (
            <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-400" aria-hidden="true">
            <span className="h-px flex-1 bg-gray-200" />
            <span>OR</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2.5 rounded-xl transition-colors"
          >
            Continue as Demo Student
          </button>
          <p className="-mt-3 text-center text-xs text-gray-500">
            Demo mode only. Changes may not be saved to your account.
          </p>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
