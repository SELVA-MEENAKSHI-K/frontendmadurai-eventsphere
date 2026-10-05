import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(user?.full_name ?? '')
  const [college, setCollege] = useState(user?.college ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFullName(user?.full_name ?? '')
    setCollege(user?.college ?? '')
  }, [user?.full_name, user?.college])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!fullName.trim()) {
      toast.error('Please enter your name.')
      return
    }

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

  const initials = (user?.full_name || user?.email || 'U')
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('')

  return (
    <>
      <Helmet>
        <title>My Profile — Madurai EventSphere</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600 mb-1">Your account</p>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-2">View and update your EventSphere profile details.</p>
        </div>

        {user?.isDemo && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Demo profile — changes are saved only in this browser.
          </div>
        )}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-6 sm:p-8 border-b border-gray-100">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold" aria-label={`Avatar for ${user?.full_name}`}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-gray-900 truncate">{user?.full_name}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              <span className="inline-flex mt-2 rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-semibold capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <label htmlFor="profile-full-name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                id="profile-full-name"
                type="text"
                value={fullName}
                onChange={event => setFullName(event.target.value)}
                autoComplete="name"
                required
                maxLength={100}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="profile-email"
                type="email"
                value={user?.email ?? ''}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-400">Email address cannot be changed here.</p>
            </div>

            <div>
              <label htmlFor="profile-college" className="block text-sm font-medium text-gray-700 mb-1">College</label>
              <input
                id="profile-college"
                type="text"
                value={college}
                onChange={event => setCollege(event.target.value)}
                autoComplete="organization"
                maxLength={120}
                placeholder="Your college (optional)"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-300"
              >
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
