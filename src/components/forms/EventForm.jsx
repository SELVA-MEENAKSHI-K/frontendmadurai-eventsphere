import { useState } from 'react'
import { CATEGORIES, DOMAINS, MICRO_LOCATIONS } from '../../utils/constants'

const EMPTY = {
  title:            '',
  description:      '',
  category:         '',
  domain:           [],
  venue_name:       '',
  address:          '',
  micro_location:   '',
  event_date:       '',
  deadline:         '',
  eligibility:      '',
  registration_url: '',
  latitude:         null,
  longitude:        null,
}

/**
 * Reusable event form — used by EventCreatePage and EventEditPage.
 *
 * Props:
 *   initialValues  Partial<Event> | null   null = create mode
 *   onSubmit       async (formData: object) => void
 *   isLoading      boolean
 *
 * NOTE: poster_url / image upload field validates file type and size locally
 * and generates a preview. The selected File is passed to onSubmit as
 * formData._imageFile so the caller can upload it once a storage bucket is
 * confirmed. Until then the backend receives poster_url: null.
 */
export default function EventForm({ initialValues = null, onSubmit, isLoading }) {
  const [form, setForm]             = useState({ ...EMPTY, ...initialValues })
  const [errors, setErrors]         = useState({})
  const [imageFile, setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState(initialValues?.poster_url ?? null)
  const [imageError, setImageError] = useState(null)

  // ── field handlers ──────────────────────────────────────────────────────────

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  function handleDomainToggle(value) {
    setForm(prev => ({
      ...prev,
      domain: prev.domain.includes(value)
        ? prev.domain.filter(d => d !== value)
        : [...prev.domain, value],
    }))
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError(null)

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setImageError('Only JPEG, PNG, or WebP images are allowed.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image must be under 2 MB.')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  // Called by LocationPicker when user clicks the map
  function handleLocationPick(lat, lng) {
    setForm(prev => ({ ...prev, latitude: lat, longitude: lng }))
  }

  // ── validation ──────────────────────────────────────────────────────────────

  function validate() {
    const e = {}
    if (!form.title.trim())       e.title         = 'Title is required.'
    if (!form.category)           e.category      = 'Category is required.'
    if (!form.venue_name.trim())  e.venue_name    = 'Venue name is required.'
    if (!form.micro_location)     e.micro_location = 'Area is required.'
    if (!form.event_date)         e.event_date    = 'Event date is required.'

    if (form.registration_url && !/^https?:\/\/.+/.test(form.registration_url)) {
      e.registration_url = 'Registration URL must start with http:// or https://'
    }
    if (form.deadline && form.event_date && form.deadline >= form.event_date) {
      e.deadline = 'Deadline must be before the event date.'
    }
    return e
  }

  // ── submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    await onSubmit({
      title:            form.title.trim(),
      description:      form.description.trim() || null,
      category:         form.category,
      domain:           form.domain,
      venue_name:       form.venue_name.trim(),
      address:          form.address.trim() || null,
      micro_location:   form.micro_location,
      event_date:       form.event_date,
      deadline:         form.deadline || null,
      eligibility:      form.eligibility.trim() || null,
      registration_url: form.registration_url.trim() || null,
      latitude:         form.latitude  ?? null,
      longitude:        form.longitude ?? null,
      poster_url:       null,   // set by caller once storage bucket is available
      _imageFile:       imageFile,
    })
  }

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">

      {/* Title */}
      <Field id="title" label="Event title *" error={errors.title}>
        <input
          id="title" name="title" type="text"
          value={form.title} onChange={handleChange} required
          placeholder="e.g. HackMadurai 2026"
          className={inputCls(errors.title)}
        />
      </Field>

      {/* Description */}
      <Field id="description" label="Description" error={errors.description}>
        <textarea
          id="description" name="description"
          value={form.description} onChange={handleChange}
          rows={4} placeholder="Tell participants what this event is about…"
          className={inputCls()}
        />
      </Field>

      {/* Category */}
      <Field id="category" label="Category *" error={errors.category}>
        <select
          id="category" name="category"
          value={form.category} onChange={handleChange} required
          className={inputCls(errors.category)}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      {/* Domain multi-checkbox */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">Domains</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DOMAINS.map(d => (
            <label
              key={d.value}
              className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                form.domain.includes(d.value)
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              <input
                type="checkbox"
                checked={form.domain.includes(d.value)}
                onChange={() => handleDomainToggle(d.value)}
                className="sr-only"
              />
              {d.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Venue name */}
      <Field id="venue_name" label="Venue name *" error={errors.venue_name}>
        <input
          id="venue_name" name="venue_name" type="text"
          value={form.venue_name} onChange={handleChange} required
          placeholder="e.g. Thiagarajar College of Engineering"
          className={inputCls(errors.venue_name)}
        />
      </Field>

      {/* Address */}
      <Field id="address" label="Address" error={errors.address}>
        <input
          id="address" name="address" type="text"
          value={form.address} onChange={handleChange}
          placeholder="Street address (optional)"
          className={inputCls()}
        />
      </Field>

      {/* Micro-location */}
      <Field id="micro_location" label="Area *" error={errors.micro_location}>
        <select
          id="micro_location" name="micro_location"
          value={form.micro_location} onChange={handleChange} required
          className={inputCls(errors.micro_location)}
        >
          <option value="">Select an area</option>
          {MICRO_LOCATIONS.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </Field>

      {/* Location picker slot — LocationPicker is rendered by the parent and
          calls handleLocationPick; expose the handler via a data attribute
          so parent pages can reference it without prop-drilling through form */}
      {form.latitude != null && form.longitude != null && (
        <p className="text-xs text-gray-500">
          📍 {Number(form.latitude).toFixed(6)}, {Number(form.longitude).toFixed(6)}
        </p>
      )}

      {/* Event date */}
      <Field id="event_date" label="Event date & time *" error={errors.event_date}>
        <input
          id="event_date" name="event_date" type="datetime-local"
          value={form.event_date} onChange={handleChange} required
          className={inputCls(errors.event_date)}
        />
      </Field>

      {/* Deadline */}
      <Field id="deadline" label="Registration deadline" error={errors.deadline}>
        <input
          id="deadline" name="deadline" type="datetime-local"
          value={form.deadline} onChange={handleChange}
          className={inputCls(errors.deadline)}
        />
      </Field>

      {/* Eligibility */}
      <Field id="eligibility" label="Eligibility" error={errors.eligibility}>
        <textarea
          id="eligibility" name="eligibility"
          value={form.eligibility} onChange={handleChange}
          rows={2} placeholder="e.g. Open to all college students"
          className={inputCls()}
        />
      </Field>

      {/* Registration URL */}
      <Field id="registration_url" label="Registration URL" error={errors.registration_url}>
        <input
          id="registration_url" name="registration_url" type="url"
          value={form.registration_url} onChange={handleChange}
          placeholder="https://forms.google.com/…"
          className={inputCls(errors.registration_url)}
        />
      </Field>

      {/* Poster image — local preview only until storage bucket is confirmed */}
      <div>
        <label htmlFor="poster" className="block text-sm font-medium text-gray-700 mb-1">
          Event poster{' '}
          <span className="text-gray-400 font-normal">(JPEG / PNG / WebP, max 2 MB)</span>
        </label>
        <input
          id="poster"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-sm file:font-medium hover:file:bg-blue-100"
        />
        {imageError && (
          <p className="text-xs text-red-500 mt-1">{imageError}</p>
        )}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Poster preview"
            className="mt-3 h-32 w-auto rounded-xl object-cover border border-gray-100"
          />
        )}
        <p className="text-xs text-gray-400 mt-1">
          Image upload to Supabase Storage will be enabled once the event-posters bucket is confirmed.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        {isLoading ? 'Saving…' : 'Save event'}
      </button>
    </form>
  )
}

// ── helpers ────────────────────────────────────────────────────────────────────

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function inputCls(error) {
  return `w-full border ${
    error ? 'border-red-400' : 'border-gray-200'
  } rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white`
}
