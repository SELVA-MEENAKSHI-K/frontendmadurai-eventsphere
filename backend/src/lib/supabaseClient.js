// ── Server-only Supabase admin client ─────────────────────────────────────────
// Uses the SERVICE ROLE key — bypasses RLS.
// NEVER import this file from frontend code.
// ──────────────────────────────────────────────────────────────────────────────
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error(
    '[supabaseClient] SUPABASE_URL is not set. ' +
    'Add it to backend/.env before starting the server.'
  )
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    '[supabaseClient] SUPABASE_SERVICE_ROLE_KEY is not set. ' +
    'Add it to backend/.env before starting the server.'
  )
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export default supabase
