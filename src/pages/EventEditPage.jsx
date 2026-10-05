import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import EventForm from '../components/forms/EventForm'
import LocationPicker from '../components/forms/LocationPicker'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { getEventById, updateEvent } from '../services/eventService'
import { eventToForm, formToPayload } from '../utils/eventValidation'

export default function EventEditPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState(null)
  const [pin, setPin]           = useState({ latitude: null, longitude: null })
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [fetchError, setFetchError]     = useState(null)
  const [isSaving, setIsSaving]         = useState(false)

  // Load the existing event and convert it to form state
  useEffect(() => {
    async function load() {
      try {
        const result = await getEventById(id)
        const event  = result?.data ?? result

        // Pre-fill the location pin from the existing event coordinates
        if (event.latitude != null && event.longitude != null) {
          setPin({ latitude: event.latitude, longitude: event.longitude })
        }

        setInitialValues(eventToForm(event))
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setLoadingEvent(false)
      }
    }
    load()
  }, [id])

  async function handleSubmit(formData, isPublished) {
    setIsSaving(true)
    try {
      // Merge the map pin into the payload; strip the internal _imageFile flag
      const payload = formToPayload(
        { ...formData, latitude: pin.latitude ?? formData.latitude, longitude: pin.longitude ?? formData.longitude },
        isPublished
      )
      delete payload._imageFile

      await updateEvent(id, payload)
      toast.success('Event updated!')
      navigate('/organizer/dashboard')
    } catch (err) {
      toast.error(err.message ?? 'Failed to update event.')
    } finally {
      setIsSaving(false)
    }
  }

  if (loadingEvent) return <LoadingSpinner message="Loading event…" />

  if (fetchError || !initialValues) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">{fetchError ?? 'Event not found.'}</p>
        <Link to="/organizer/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Edit Event — Madurai EventSphere</title>
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
          <h1 className="text-2xl font-bold text-gray-900">Edit event</h1>
          <p className="text-sm text-gray-500 mt-1">
            Changes are saved as drafts unless you choose to publish.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Location picker — sits above the form so the pin is available on submit */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Pin location on map{' '}
              <span className="text-gray-400 font-normal">(click to update)</span>
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
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        </div>
      </div>
    </>
  )
}
