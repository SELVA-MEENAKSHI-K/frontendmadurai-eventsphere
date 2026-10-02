// Vercel serverless entry point
// Vercel calls this file for every request to /api/*
// It simply imports and re-exports the Express app — Vercel handles the HTTP layer.
import app from '../src/app.js'

export default app
