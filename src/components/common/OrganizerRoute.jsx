import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

/** Only signed-in users with role "organizer" may pass. Others go home. */
export default function OrganizerRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner message="Checking access..." />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role !== 'organizer') return <Navigate to="/" replace />
  return children
}
