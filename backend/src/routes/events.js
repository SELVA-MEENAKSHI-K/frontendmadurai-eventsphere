import { Router } from 'express'
import supabase from '../lib/supabaseClient.js'
import { auth } from '../middleware/auth.js'

const router = Router()

// ── GET / ─────────────────────────────────────────────────────────────────────
// Returns published events ordered by event_date ascending.
// Supports optional query params:
//   category       — exact match on category
//   domain         — TEXT[] column contains this value
//   micro_location — exact match on micro_location
//   date_from      — event_date >= value (ISO date string)
//   date_to        — event_date <= value (ISO date string)
//   search         — case-insensitive match on title or description
// Response: { success: true, data: [...], count: N }
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { category, domain, micro_location, date_from, date_to, search } = req.query

    let query = supabase
      .from('events')
      .select('*')
      .eq('is_published', true)

    if (category) {
      query = query.eq('category', category)
    }

    if (domain) {
      // domain is stored as TEXT[] — contains() checks the array includes the value
      query = query.contains('domain', [domain])
    }

    if (micro_location) {
      query = query.eq('micro_location', micro_location)
    }

    if (date_from) {
      query = query.gte('event_date', date_from)
    }

    if (date_to) {
      query = query.lte('event_date', date_to)
    }

    if (search) {
      // ilike is case-insensitive; searches title and description
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    query = query.order('event_date', { ascending: true })

    const { data, error } = await query

    if (error) throw error

    res.json({ success: true, data, count: data.length })
  } catch (err) {
    next(err)
  }
})

// ── GET /:id ──────────────────────────────────────────────────────────────────
// Returns full details for a single published event, including organiser name
// and college via the organizer_id → profiles FK join.
// Response: { success: true, data: { ...event, organizer: { full_name, college } } }
// Returns 404 if the event does not exist or is not published.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:organizer_id (
          full_name,
          college
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      // PostgREST returns PGRST116 when .single() finds no rows
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Event not found.' })
      }
      throw error
    }

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
})

// ── POST / ────────────────────────────────────────────────────────────────────
// Creates a new event. Requires organizer role.
// organizer_id is always set from req.user.id — never trusted from the body.
// Response: { success: true, data: { ...newEvent } }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', auth, async (req, res, next) => {
  try {
    // Verify the authenticated user has organizer role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (profileError || !profile) {
      return res.status(403).json({ success: false, error: 'Profile not found.' })
    }
    if (profile.role !== 'organizer') {
      return res.status(403).json({ success: false, error: 'Only organisers can create events.' })
    }

    const {
      title, description, category, domain, venue_name, address,
      micro_location, latitude, longitude, event_date, deadline,
      eligibility, registration_url, poster_url, is_published,
    } = req.body

    const { data, error } = await supabase
      .from('events')
      .insert({
        organizer_id: req.user.id,
        title, description, category,
        domain:           domain ?? [],
        venue_name, address, micro_location,
        latitude:         latitude  ?? null,
        longitude:        longitude ?? null,
        event_date, deadline: deadline ?? null,
        eligibility:      eligibility      ?? null,
        registration_url: registration_url ?? null,
        poster_url:       poster_url       ?? null,
        is_published:     is_published     ?? false,
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
})

// ── PUT /:id ──────────────────────────────────────────────────────────────────
// Updates an event. Organizer must own the event.
// Response: { success: true, data: { ...updatedEvent } }
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params

    // Ownership check
    const { data: existing, error: fetchError } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, error: 'Event not found.' })
    }
    if (existing.organizer_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'You do not own this event.' })
    }

    // Strip organizer_id from body — never allow reassignment
    const { organizer_id: _drop, ...updates } = req.body

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
})

// ── DELETE /:id ───────────────────────────────────────────────────────────────
// Deletes an event. Organizer must own the event.
// Response: { success: true, data: { deleted: true } }
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params

    // Ownership check
    const { data: existing, error: fetchError } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, error: 'Event not found.' })
    }
    if (existing.organizer_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'You do not own this event.' })
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true, data: { deleted: true } })
  } catch (err) {
    next(err)
  }
})

export default router
