import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

import { AuthProvider, useAuth } from './context/AuthContext'
import { FilterProvider } from './context/FilterContext'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

import HomePage from './pages/HomePage'
import EventDetailPage from './pages/EventDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookmarksPage from './pages/BookmarksPage'
import EventCreatePage from './pages/EventCreatePage'
import NotFoundPage from './pages/NotFoundPage'

// Redirects unauthenticated users to /login and students to /.
// Only organizers pass through.
function OrganizerRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner message="Checking permissions…" />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'organizer') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <FilterProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  <Route path="/"           element={<HomePage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/login"      element={<LoginPage />} />
                  <Route path="/register"   element={<RegisterPage />} />
                  <Route
                    path="/bookmarks"
                    element={
                      <ProtectedRoute>
                        <BookmarksPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/events/new"
                    element={
                      <OrganizerRoute>
                        <EventCreatePage />
                      </OrganizerRoute>
                    }
                  />
                  <Route path="*"           element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />
            </div>

            {/* Global toast notifications */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '12px',
                  fontSize: '14px',
                },
              }}
            />
          </FilterProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
