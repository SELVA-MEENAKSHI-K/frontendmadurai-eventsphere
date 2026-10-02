/**
 * Backend API tests — health endpoint and unknown route behaviour
 * Madurai EventSphere
 *
 * Uses supertest to make HTTP requests directly against the Express app
 * (no server needs to start — supertest calls the app in-process).
 *
 * Linked requirements:
 *   T1-02 verification: "GET /api/health returns { success: true, message: 'EventSphere API running' }"
 *   NFR-02: server must not crash on unexpected input
 *   NFR-04: CORS headers must be present so the frontend can connect
 */

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

// ---------------------------------------------------------------------------
// GET /api/health
// ---------------------------------------------------------------------------

describe('GET /api/health', () => {

  it('returns HTTP 200', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
  })

  it('returns { success: true }', async () => {
    const res = await request(app).get('/api/health')
    expect(res.body.success).toBe(true)
  })

  it('returns the exact spec message', async () => {
    const res = await request(app).get('/api/health')
    expect(res.body.message).toBe('EventSphere API running')
  })

  it('returns JSON content-type', async () => {
    const res = await request(app).get('/api/health')
    expect(res.headers['content-type']).toMatch(/application\/json/)
  })

  it('includes CORS header so the frontend can connect (NFR-04)', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173')
    expect(res.headers['access-control-allow-origin']).toBeDefined()
  })

})

// ---------------------------------------------------------------------------
// Unknown routes — server must not crash (NFR-02)
// ---------------------------------------------------------------------------

describe('Unknown routes', () => {

  it('GET /api/unknown returns 404 (not a 500 or crash)', async () => {
    const res = await request(app).get('/api/unknown')
    expect(res.status).toBe(404)
  })

  it('GET / returns 404 (root path is not handled)', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(404)
  })

  it('POST /api/health returns 404 (method not allowed falls through to 404)', async () => {
    const res = await request(app).post('/api/health')
    expect(res.status).toBe(404)
  })

  it('server responds to unknown routes without throwing a 500', async () => {
    const res = await request(app).get('/api/this/route/does/not/exist')
    // Must be a controlled response (404), never an unhandled crash (500)
    expect(res.status).not.toBe(500)
  })

})
