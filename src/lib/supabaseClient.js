// ── Browser-only Supabase client ──────────────────────────────────────────────
// Single shared instance — imported by AuthContext and api.js.
// Uses the publishable anon key only. Never use the service-role key here.
// ──────────────────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[supabaseClient] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env.local'
  )
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
