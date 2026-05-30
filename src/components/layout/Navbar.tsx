import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ArrowRight } from 'lucide-react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { routeNavLinks } from '../data/homeData'
import { ThemeToggle, BrandLogo } from '../ui/Shared'
import type { StoreThemeMode } from '../../hooks/useStoreTheme'

export default function Navbar({ theme, onToggle }: { theme: StoreThemeMode; onToggle: (nextTheme: StoreThemeMode) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  const sectionTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let cancelled = false

    const attachAuth = async () => {
      const [{ onAuthStateChanged }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('../../services/firebase'),
      ])

      if (cancelled) return

      setIsAuthenticated(Boolean(auth.currentUser))
      unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        if (!cancelled) setIsAuthenticated(Boolean(nextUser))
      })
    }

    attachAuth().catch(() => setIsAuthenticated(false))

    return () => {
      cancelled = true
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const [{ signOut }, { auth }] = await Promise.all([
      import('firebase/auth'),
      import('../../services/firebase'),
    ])
    await signOut(auth)
  }

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]',
      isActive ? 'text-[color:var(--accent)]' : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]',
    ].join(' ')

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'theme-card rounded-2xl px-4 py-3 text-sm font-medium transition',
      isActive ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]' : 'text-[color:var(--text-primary)]/90',
    ].join(' ')

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo />
          <div>
            <p className="text-sm font-semibold tracking-[0.28em] text-[color:var(--text-primary)]/90">FREE APP & GAME STORE</p>
            <p className="text-xs text-[color:var(--text-secondary)]">Open-source marketplace</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {routeNavLinks.map((link) => (
            <NavLink key={link.label} to={link.to} end className={desktopLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle theme={theme} onToggle={onToggle} />
          {isAuthenticated ? (
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          )}
          <Link to="/publish" className="btn btn-primary inline-flex items-center gap-2">
            Publish App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] shadow-sm transition hover:bg-[color:var(--accent-soft)] lg:hidden"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={sectionTransition} className="border-t border-[color:var(--border-color)] bg-[color:var(--bg-primary)] px-4 py-4 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-3">
              {routeNavLinks.map((link) => (
                <NavLink key={link.label} to={link.to} end className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </NavLink>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <ThemeToggle theme={theme} onToggle={onToggle} />
                <Link to="/publish" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  Publish App
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
