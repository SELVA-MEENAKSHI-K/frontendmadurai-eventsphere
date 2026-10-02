import { describe, it, expect } from 'vitest'
import request from 'supertest'

process.env.VERCEL = '1'
const { default: app } = await import('../app.js')

describe('EventSphere API', () => {
  it('health endpoint success response tharudhu', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      success: true,
      message: 'EventSphere API running',
    })
  })

  it('theriyaadha route-ku 404 tharudhu', async () => {
    const response = await request(app).get('/api/not-a-real-route')

    expect(response.status).toBe(404)
  })
})