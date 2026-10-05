import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [demoUser, setDemoUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('eventsphere_demo_user') || 'null')
    } catch {
      return null
    }
  })
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
    sessionStorage.removeItem('eventsphere_demo_user')
    setDemoUser(null)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  function loginAsDemo() {
    const demo = {
      id: 'demo-student',
      email: 'demo@student.eventsphere.local',
      user_metadata: { full_name: 'Demo Student', role: 'student', college: 'Demo College' },
    }
    sessionStorage.setItem('eventsphere_demo_user', JSON.stringify(demo))
    setDemoUser(demo)
  }

  async function updateProfile({ full_name, college }) {
    if (demoUser) {
      const updated = {
        ...demoUser,
        user_metadata: {
          ...demoUser.user_metadata,
          full_name: full_name.trim(),
          college: college.trim() || null,
        },
      }
      sessionStorage.setItem('eventsphere_demo_user', JSON.stringify(updated))
      setDemoUser(updated)
      return updated
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: full_name.trim(), college: college.trim() || null },
    })
    if (error) throw error
    if (data.user) setUser(data.user)
    return data.user
  }

  async function logout() {
    if (demoUser) {
      sessionStorage.removeItem('eventsphere_demo_user')
      setDemoUser(null)
      await supabase.auth.signOut()
      return
    }
    await supabase.auth.signOut()
  }

  const activeUser = demoUser ?? user
  const profile = activeUser
    ? {
        id:        activeUser.id,
        email:     activeUser.email,
        full_name: activeUser.user_metadata?.full_name ?? activeUser.email,
        role:      activeUser.user_metadata?.role ?? 'student',
        college:   activeUser.user_metadata?.college ?? null,
        isDemo:    Boolean(demoUser),
      }
    : null

  return (
    <AuthContext.Provider value={{ user: profile, loading, login, loginAsDemo, register, updateProfile, logout, supabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
