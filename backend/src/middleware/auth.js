import supabase from '../lib/supabaseClient.js'

// ── auth middleware ───────────────────────────────────────────────────────────
// Verifies the Supabase JWT in the Authorization: Bearer <token> header.
// On success, attaches req.user = { id, email } and calls next().
// On failure, returns 401 — no stack trace exposed to the client.
// ─────────────────────────────────────────────────────────────────────────────
export async function auth(req, res, next) {
  const authHeader = req.headers.authorization ?? ''

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header.' })
  }

  const token = authHeader.slice(7) // strip "Bearer "

  try {
    // getUser() validates the JWT against Supabase and returns the user
    // associated with the token. It works even with the service role client.
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token.' })
    }

    req.user = { id: user.id, email: user.email }
    next()
  } catch {
    return res.status(401).json({ success: false, error: 'Token verification failed.' })
  }
}
