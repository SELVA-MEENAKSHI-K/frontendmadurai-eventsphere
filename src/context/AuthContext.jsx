import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function register({ email, password, full_name, role, college }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role, college: college || null },
      },
    })
    if (error) throw error
    return data
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  const profile = user
    ? {
        id:        user.id,
        email:     user.email,
        full_name: user.user_metadata?.full_name ?? user.email,
        role:      user.user_metadata?.role ?? 'student',
        college:   user.user_metadata?.college ?? null,
      }
    : null

  return (
    <AuthContext.Provider value={{ user: profile, loading, login, register, logout, supabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
