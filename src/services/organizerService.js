import api from './api'

/** All events (draft + published) owned by the signed-in organizer. */
export async function getMyEvents() {
  const response = await api.get('/api/organizer/events')
  return response.data
}

/** Toggle is_published on an owned event. */
export async function togglePublish(id) {
  const response = await api.put(`/api/organizer/events/${id}/publish`)
  return response.data
}
