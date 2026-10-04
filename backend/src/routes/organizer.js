import { Router } from 'express'
import supabase from '../lib/supabaseClient.js'
import { auth } from '../middleware/auth.js'

const router = Router()

// All organizer routes require authentication
router.use(auth)

// ── GET /events ───────────────────────────────────────────────────────────────
// Returns all events (draft + published) owned by the authenticated organizer.
// Response: { success: true, data: [...], count: N }
// ─────────────────────────────────────────────────────────────────────────────
router.get('/events', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_stats ( bookmark_count, view_count )
      `)
      .eq('organizer_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ success: true, data, count: data.length })
  } catch (err) {
    next(err)
  }
})

// ── PUT /events/:id/publish ───────────────────────────────────────────────────
// Toggles is_published for an event the organizer owns.
// Response: { success: true, data: { id, is_published } }
// ─────────────────────────────────────────────────────────────────────────────
router.put('/events/:id/publish', async (req, res, next) => {
  try {
    const { id } = req.params

    // Ownership + current state in one query
    const { data: existing, error: fetchError } = await supabase
      .from('events')
      .select('organizer_id, is_published')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, error: 'Event not found.' })
    }
    if (existing.organizer_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'You do not own this event.' })
    }

    const { data, error } = await supabase
      .from('events')
      .update({ is_published: !existing.is_published })
      .eq('id', id)
      .select('id, is_published')
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
})

export default router
