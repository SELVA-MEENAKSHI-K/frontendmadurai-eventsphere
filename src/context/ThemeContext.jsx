import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

/** Reads the user's stored preference, falling back to prefers-color-scheme. */
function getInitialTheme() {
  try {
    const stored = localStorage.getItem('es-theme')
    if (stored === 'dark' || stored === 'light') return stored
  } catch { /* localStorage blocked */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try { localStorage.setItem('es-theme', theme) } catch { /* ignore */ }
  }, [theme])

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
