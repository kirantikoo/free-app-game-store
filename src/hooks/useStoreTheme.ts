import { useEffect, useState } from 'react'

export type StoreThemeMode = 'dark' | 'light'

export function useStoreTheme() {
  const [theme, setTheme] = useState<StoreThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark'
    return window.localStorage.getItem('fas-theme') === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    window.localStorage.setItem('fas-theme', theme)
    document.documentElement.dataset.theme = theme
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme, setTheme }
}