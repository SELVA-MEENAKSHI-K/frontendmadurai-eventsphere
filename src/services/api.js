import axios from 'axios'
import supabase from '../lib/supabaseClient'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.request.use(async config => {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const message =
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  }
)

export default api
