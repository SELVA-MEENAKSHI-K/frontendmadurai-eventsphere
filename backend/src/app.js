import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import eventsRouter from './routes/events.js'

const app = express()
const PORT = process.env.PORT ?? 3001

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Health check ──────────────────────────────────────────────────────────────
// GET /api/health → { success: true, message: "EventSphere API running" }
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'EventSphere API running' })
})

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/events', eventsRouter)

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

// ── Start (only when run directly, not when imported by Vercel) ───────────────
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`EventSphere API running on http://localhost:${PORT}`)
  })
}

export default app
