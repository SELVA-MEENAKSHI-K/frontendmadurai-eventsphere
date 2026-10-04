import { Router } from 'express'
import supabase from '../lib/supabaseClient.js'
import { auth } from '../middleware/auth.js'

const router = Router()

// All bookmark routes require authentication
router.use(auth)

// ── GET / ─────────────────────────────────────────────────────────────────────
// Returns all bookmarks for the authenticated user, with full event data.
// Response: { success: true, data: [...], count: N }
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        id,
        event_id,
        created_at,
        event:event_id (
          id, title, category, domain, venue_name,
          micro_location, event_date, deadline, poster_url,
          is_published
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ success: true, data, count: data.length })
  } catch (err) {
    next(err)
  }
})

// ── POST / ────────────────────────────────────────────────────────────────────
// Adds a bookmark for the authenticated user.
// Body: { event_id: uuid }
// Ignores duplicates silently (UNIQUE constraint → upsert with onConflict ignore).
// Response: { success: true, data: { id, user_id, event_id, created_at } }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { event_id } = req.body

    if (!event_id) {
      return res.status(400).json({ success: false, error: 'event_id is required.' })
    }

    // Try a plain insert first. If the row already exists the UNIQUE constraint
    // fires and Supabase returns a 23505 error — we catch that and return the
    // existing row instead, so the response is always consistent.
    const { data: inserted, error: insertError } = await supabase
      .from('bookmarks')
      .insert({ user_id: req.user.id, event_id })
      .select()
      .single()

    if (insertError) {
      // 23505 = unique_violation — bookmark already exists, fetch and return it
      if (insertError.code === '23505') {
        const { data: existing, error: fetchError } = await supabase
          .from('bookmarks')
          .select()
          .eq('user_id', req.user.id)
          .eq('event_id', event_id)
          .single()

        if (fetchError) throw fetchError
        return res.status(200).json({ success: true, data: existing })
      }
      throw insertError
    }

    res.status(201).json({ success: true, data: inserted })
  } catch (err) {
    next(err)
  }
})

// ── DELETE /:event_id ─────────────────────────────────────────────────────────
// Removes a bookmark for the authenticated user.
// Response: { success: true, data: { deleted: true } }
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:event_id', async (req, res, next) => {
  try {
    const { event_id } = req.params

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', req.user.id)
      .eq('event_id', event_id)

    if (error) throw error

    res.json({ success: true, data: { deleted: true } })
  } catch (err) {
    next(err)
  }
})

export default router
