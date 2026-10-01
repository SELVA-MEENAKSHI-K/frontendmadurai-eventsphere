import api from './api'

/**
 * Fetch all published events, with optional filters.
 * @param {Object} filters - { category, domain, micro_location, date_from, date_to, search }
 */
export async function getEvents(filters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  )
  const response = await api.get('/api/events', { params })
  return response.data
}

/**
 * Fetch a single event by ID.
 */
export async function getEventById(id) {
  const response = await api.get(`/api/events/${id}`)
  return response.data
}

/**
 * Create a new event (organizer only).
 */
export async function createEvent(eventData) {
  const response = await api.post('/api/events', eventData)
  return response.data
}

/**
 * Update an existing event (organizer only — must own the event).
 */
export async function updateEvent(id, updates) {
  const response = await api.put(`/api/events/${id}`, updates)
  return response.data
}

/**
 * Delete an event (organizer only — must own the event).
 */
export async function deleteEvent(id) {
  const response = await api.delete(`/api/events/${id}`)
  return response.data
}
