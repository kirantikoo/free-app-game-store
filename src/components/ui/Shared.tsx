import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MoonStar, SunMedium, ChevronLeft, ChevronRight } from 'lucide-react'
import logo from '../../assets/logo.png'
import type { IconType } from '../data/homeData'
import type { StoreThemeMode } from '../../hooks/useStoreTheme'

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]/80">{eyebrow}</p>
          <h2 className="theme-heading mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h2>
          <p className="theme-text-muted mt-4 max-w-2xl text-base leading-7 sm:text-lg">{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  )
}

export function ThemeToggle({ theme, onToggle }: { theme: StoreThemeMode; onToggle: (nextTheme: StoreThemeMode) => void }) {
  const prefersReduced = useReducedMotion()

  return (
    <div className="theme-card relative grid min-w-[11rem] grid-cols-2 overflow-hidden rounded-full p-1">
      <motion.span
        initial={false}
        animate={{ x: theme === 'dark' ? '100%' : '0%' }}
        transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 28 }}
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_24px_rgba(139,92,246,0.28)]"
      />
      <button
        type="button"
        onClick={() => onToggle('light')}
        aria-pressed={theme === 'light'}
        aria-label="Switch to light mode"
        title="Light"
        className={['relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]', theme === 'light' ? 'text-white' : 'text-[color:var(--text-primary)]'].join(' ')}
      >
        <SunMedium className="h-4 w-4" />
        <span>Light</span>
      </button>
      <button
        type="button"
        onClick={() => onToggle('dark')}
        aria-pressed={theme === 'dark'}
        aria-label="Switch to dark mode"
        title="Dark"
        className={['relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]', theme === 'dark' ? 'text-white' : 'text-[color:var(--text-primary)]'].join(' ')}
      >
        <MoonStar className="h-4 w-4" />
        <span>Dark</span>
      </button>
    </div>
  )
}

export function AnimatedCounter({ value, suffix, className = 'text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]' }: { value: number; suffix: string; className?: string }) {
  const [count, setCount] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const start = performance.now()
    const duration = 1300

    const frame = (current: number) => {
      const progress = Math.min((current - start) / duration, 1)
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  }, [prefersReducedMotion, value])

  return <span className={className}>{(prefersReducedMotion ? value : count).toLocaleString() + suffix}</span>
}

export function CompactMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="theme-card rounded-2xl px-3 py-3 text-center backdrop-blur-md">
      <p className="text-sm font-semibold text-[color:var(--text-primary)]">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-[color:var(--text-secondary)]">{label}</p>
    </div>
  )
}

export function MiniFeature({ icon: Icon, label }: { icon: IconType; label: string }) {
  return (
    <div className="theme-card flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-[color:var(--text-secondary)]">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </div>
  )
}

export function PipelineStep({ label, progress }: { label: string; progress: string }) {
  return (
    <div className="theme-card rounded-2xl p-3">
      <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]">
        <span>{label}</span>
        <span className="text-[color:var(--accent)]">{progress}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--bg-secondary)]">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
      </div>
    </div>
  )
}

export function FeatureTile({ icon: Icon, label }: { icon: IconType; label: string }) {
  return (
    <div className="theme-card rounded-[1.4rem] p-5 text-center backdrop-blur-md">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-[color:var(--accent)]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-[color:var(--text-primary)]">{label}</p>
    </div>
  )
}

export function RailControls({ onPrevious, onNext }: { onPrevious: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrevious}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]"
        aria-label="Scroll previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]"
        aria-label="Scroll next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export function BrandLogo() {
  return (
    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] shadow-[0_0_28px_rgba(124,58,237,0.12)]">
      <img src={logo} alt="Free App & Game Store logo" className="h-full w-full object-cover" />
    </div>
  )
}

export function GitHubBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.2-3.3-1.2-.4-1-.9-1.3-.9-1.3-.7-.5 0-.5 0-.5.8.1 1.2.8 1.2.8.7 1.2 1.8.9 2.2.7.1-.5.3-.9.6-1.1-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 3 .9a10.2 10.2 0 0 1 5.4 0c2.1-1.2 3-.9 3-.9.6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.7-2.3 4.5-4.5 4.8.3.2.6.8.6 1.6v2.3c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2Z" />
    </svg>
  )
}

export function LinkedInBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.94 6.5A1.94 1.94 0 1 1 3.06 6.5a1.94 1.94 0 0 1 3.88 0ZM3.4 8.9h3.1v11.6H3.4V8.9Zm5.4 0h3v1.58h.04c.42-.8 1.45-1.64 2.98-1.64 3.18 0 3.77 2.09 3.77 4.8v6.86h-3.1v-6.08c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.2v6.19h-3.1V8.9Z" />
    </svg>
  )
}

// no default export
