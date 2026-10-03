import { Router } from 'express'
import supabase from '../lib/supabaseClient.js'

const router = Router()

// ── GET / ─────────────────────────────────────────────────────────────────────
// Returns all published events ordered by event_date ascending.
// Response: { success: true, data: [...], count: N }
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('event_date', { ascending: true })

    if (error) throw error

    res.json({ success: true, data, count: data.length })
  } catch (err) {
    next(err)
  }
})

export default router
