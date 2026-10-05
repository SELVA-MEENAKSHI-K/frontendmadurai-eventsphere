import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import EventForm from '../components/forms/EventForm'
import LocationPicker from '../components/forms/LocationPicker'
import { createEvent } from '../services/eventService'

export default function EventCreatePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [pin, setPin] = useState({ latitude: null, longitude: null })

  async function handleSubmit(formData) {
    setIsLoading(true)
    try {
      // Merge the location pin into the payload.
      // poster_url remains null until the event-posters storage bucket is confirmed.
      const payload = { ...formData, ...pin }
      delete payload._imageFile

      await createEvent(payload)
      toast.success('Event created! You can publish it from your dashboard.')
      navigate('/organizer/dashboard')
    } catch (err) {
      toast.error(err.message ?? 'Failed to create event.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Event — Madurai EventSphere</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/organizer/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create a new event</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below. Events are saved as drafts — publish from your dashboard when ready.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Location picker sits above the form so the pin coordinates
              are available when the form submits */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Pin location on map{' '}
              <span className="text-gray-400 font-normal">(click to set)</span>
            </p>
            <LocationPicker
              latitude={pin.latitude}
              longitude={pin.longitude}
              onPick={(lat, lng) => setPin({ latitude: lat, longitude: lng })}
            />
            {pin.latitude != null && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {pin.latitude.toFixed(6)}, {pin.longitude.toFixed(6)}
              </p>
            )}
          </div>

          <EventForm
            initialValues={null}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  )
}
