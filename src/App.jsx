import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './context/AuthContext'
import { FilterProvider } from './context/FilterContext'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import OrganizerRoute from './components/common/OrganizerRoute'

import HomePage from './pages/HomePage'
import EventDetailPage from './pages/EventDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookmarksPage from './pages/BookmarksPage'
import EventCreatePage from './pages/EventCreatePage'
import EventEditPage from './pages/EventEditPage'
import OrganizerDashboardPage from './pages/OrganizerDashboardPage'
import DemoRegistrationsPage from './pages/DemoRegistrationsPage'
import DemoCheckinPage from './pages/DemoCheckinPage'
import NotFoundPage from './pages/NotFoundPage'

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
                    path="/organizer/dashboard"
                    element={
                      <OrganizerRoute>
                        <OrganizerDashboardPage />
                      </OrganizerRoute>
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
                  {/* /organizer/events/:id/edit wired in T4-03 */}
                  <Route
                    path="/organizer/events/:id/edit"
                    element={
                      <OrganizerRoute>
                        <EventEditPage />
                      </OrganizerRoute>
                    }
                  />
                  <Route
                    path="/my-registrations"
                    element={
                      <ProtectedRoute>
                        <DemoRegistrationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer/checkin"
                    element={
                      <OrganizerRoute>
                        <DemoCheckinPage />
                      </OrganizerRoute>
                    }
                  />
                  <Route path="*"           element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />
            </div>

            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: { borderRadius: '12px', fontSize: '14px' },
              }}
            />
          </FilterProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
