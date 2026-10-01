import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './context/AuthContext'
import { FilterProvider } from './context/FilterContext'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

import HomePage from './pages/HomePage'
import EventDetailPage from './pages/EventDetailPage'
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
