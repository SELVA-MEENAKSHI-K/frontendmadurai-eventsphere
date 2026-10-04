import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getBookmarks, addBookmark, removeBookmark } from '../services/bookmarkService'

/**
 * Manages the authenticated user's bookmarks.
 *
 * Returns:
 *   bookmarkedIds  — Set of bookmarked event UUIDs (O(1) .has() lookups)
 *   loading        — true while the initial fetch is in progress
 *   toggleBookmark — adds or removes a bookmark with optimistic update + rollback
 */
export default function useBookmarks() {
  const { user } = useAuth()
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
  const [loading, setLoading]             = useState(false)

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarkedIds(new Set())
      return
    }
    setLoading(true)
    try {
      const result = await getBookmarks()
      const ids = (result.data ?? []).map(b => b.event_id)
      setBookmarkedIds(new Set(ids))
    } catch {
      // Non-critical — leave existing state intact
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  async function toggleBookmark(eventId) {
    const isBookmarked = bookmarkedIds.has(eventId)

    // Optimistic update
    setBookmarkedIds(prev => {
      const next = new Set(prev)
      if (isBookmarked) next.delete(eventId)
      else next.add(eventId)
      return next
    })

    try {
      if (isBookmarked) {
        await removeBookmark(eventId)
        toast.success('Bookmark removed.')
      } else {
        await addBookmark(eventId)
        toast.success('Bookmarked!')
      }
    } catch {
      // Roll back optimistic update on failure
      setBookmarkedIds(prev => {
        const next = new Set(prev)
        if (isBookmarked) next.add(eventId)
        else next.delete(eventId)
        return next
      })
      toast.error(isBookmarked ? 'Failed to remove bookmark.' : 'Failed to bookmark.')
    }
  }

  return { bookmarkedIds, loading, toggleBookmark }
}
