import api from './api'

/**
 * Fetch all bookmarks for the authenticated user.
 * Each item includes the nested event object.
 * @returns {Promise<{ success: boolean, data: Bookmark[], count: number }>}
 */
export async function getBookmarks() {
  const response = await api.get('/api/bookmarks')
  return response.data
}

/**
 * Add a bookmark for the authenticated user.
 * Silently handles duplicates (backend returns the existing row).
 * @param {string} eventId
 * @returns {Promise<{ success: boolean, data: Bookmark }>}
 */
export async function addBookmark(eventId) {
  const response = await api.post('/api/bookmarks', { event_id: eventId })
  return response.data
}

/**
 * Remove a bookmark for the authenticated user.
 * @param {string} eventId
 * @returns {Promise<{ success: boolean, data: { deleted: boolean } }>}
 */
export async function removeBookmark(eventId) {
  const response = await api.delete(`/api/bookmarks/${eventId}`)
  return response.data
}
