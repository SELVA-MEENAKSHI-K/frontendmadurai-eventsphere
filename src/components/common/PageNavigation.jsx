import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function PageNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  if (location.pathname === '/') return null

  function goBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }
    navigate('/')
  }

  return (
    <nav
      aria-label="Page navigation"
      className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 pt-4 sm:px-6 lg:px-8"
    >
      <button
        type="button"
        onClick={goBack}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Go back to the previous page"
      >
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </button>
      <Link
        to="/"
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span aria-hidden="true">⌂</span>
        <span>Home</span>
      </Link>
    </nav>
  )
}
