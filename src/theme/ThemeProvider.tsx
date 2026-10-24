import { useEffect, useState, type ReactNode } from 'react'
import { storage } from '@/shared/lib/storage'
import { THEME_KEY, ThemeContext, type ThemeMode } from './useTheme'

function readMode(): ThemeMode {
  const saved = storage.get(THEME_KEY)
  return saved === 'light' || saved === 'dark' ? saved : 'system'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readMode)

  // `system` removes the attribute so tokens.css follows prefers-color-scheme live.
  useEffect(() => {
    const root = document.documentElement
    if (mode === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', mode)
  }, [mode])

  const setMode = (next: ThemeMode) => {
    if (next === 'system') storage.remove(THEME_KEY)
    else storage.set(THEME_KEY, next)
    setModeState(next)
  }

  return <ThemeContext value={{ mode, setMode }}>{children}</ThemeContext>
}
