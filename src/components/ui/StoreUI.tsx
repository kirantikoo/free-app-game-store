import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Loader2, Sparkles, UploadCloud } from 'lucide-react'
import Navbar from '../layout/Navbar'
import { particlePositions } from '../data/homeData'
import type { StoreThemeMode } from '../../hooks/useStoreTheme'

export function PageShell({
  theme,
  onToggleTheme,
  eyebrow,
  title,
  description,
  action,
  children,
  contentClassName = '',
}: {
  theme: StoreThemeMode
  onToggleTheme: (nextTheme: StoreThemeMode) => void
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
  contentClassName?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <main className="relative overflow-hidden text-[color:var(--text-primary)]">
      <div className="noise-grid absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow-orb -left-32 -top-24 h-72 w-72 bg-violet-600/40" />
        <div className="glow-orb -right-16 top-32 h-64 w-64 bg-cyan-400/25" />
        <div className="glow-orb bottom-[10%] left-[18%] h-80 w-80 bg-fuchsia-500/18" />
        <div className="glow-orb right-[14%] bottom-[16%] h-72 w-72 bg-blue-500/18" />
        {particlePositions.map((position, index) => (
          <motion.span
            key={`${position.top}-${position.left}-${index}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_18px_rgba(103,232,249,0.95)]"
            style={position}
            animate={prefersReducedMotion ? undefined : { y: [0, -14, 0], opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 5 + index * 0.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <Navbar theme={theme} onToggle={onToggleTheme} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="glass-panel-strong relative overflow-hidden rounded-[2.4rem] p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_34%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]/80">{eyebrow}</p>
              <h1 className="theme-heading mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">{title}</h1>
              <p className="theme-text-muted mt-4 max-w-3xl text-base leading-7 sm:text-lg">{description}</p>
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>
        </div>

        <div className={contentClassName ? `pt-8 ${contentClassName}` : 'pt-8'}>{children}</div>
      </section>
    </main>
  )
}

export function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[color:var(--accent)]/80">{eyebrow}</p> : null}
        <h2 className="theme-heading mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{title}</h2>
        {description ? <p className="theme-text-muted mt-3 max-w-2xl text-sm leading-7 sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function GlowButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(139,92,246,0.45)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-5 py-3 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function FieldShell({ label, helper, error, children }: { label: string; helper?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[color:var(--text-primary)]">{label}</span>
      {children}
      {helper ? <span className="mt-2 block text-xs leading-5 text-[color:var(--text-secondary)]">{helper}</span> : null}
      {error ? (
        <span className="mt-2 inline-flex items-center gap-1 text-xs text-rose-300">
          <AlertTriangle className="h-3.5 w-3.5" />
          {error}
        </span>
      ) : null}
    </label>
  )
}

const fieldClassName =
  'w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)]/85 px-4 py-3.5 text-sm text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-secondary)]/70 focus:border-[color:var(--accent)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_18%,transparent)]'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={[fieldClassName, props.className ?? ''].join(' ')} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={[fieldClassName, 'min-h-[140px] resize-y', props.className ?? ''].join(' ')} />
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={[fieldClassName, props.className ?? ''].join(' ')} />
}

export function ToggleSwitch({ checked, onChange, label, description }: { checked: boolean; onChange: () => void; label: string; description?: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="theme-card flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left"
      aria-pressed={checked}
    >
      <span>
        <span className="block text-sm font-medium text-[color:var(--text-primary)]">{label}</span>
        {description ? <span className="mt-1 block text-xs text-[color:var(--text-secondary)]">{description}</span> : null}
      </span>
      <span className={['relative inline-flex h-7 w-12 items-center rounded-full border transition', checked ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)]' : 'border-[color:var(--border-color)] bg-[color:var(--bg-secondary)]'].join(' ')}>
        <span className={['inline-block h-5 w-5 rounded-full bg-white shadow-md transition', checked ? 'translate-x-6 bg-[color:var(--accent)]' : 'translate-x-1'].join(' ')} />
      </span>
    </button>
  )
}

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'success' | 'warning' | 'info' }) {
  const tones = {
    default: 'border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-slate-700 dark:text-slate-200',
    success: 'border-emerald-400/25 bg-emerald-400/10 text-slate-900 dark:text-white',
    warning: 'border-amber-400/25 bg-amber-400/10 text-slate-900 dark:text-white',
    info: 'border-cyan-400/25 bg-cyan-400/10 text-slate-900 dark:text-white',
  }

  return <span className={['inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md', tones[tone]].join(' ')}>{children}</span>
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[color:var(--bg-secondary)]">
      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}

export function SkeletonGrid({ count = 4, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className].join(' ')}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="theme-card animate-pulse rounded-[1.8rem] p-4">
          <div className="h-44 rounded-3xl bg-[color:var(--bg-secondary)]" />
          <div className="mt-4 h-4 w-3/5 rounded-full bg-[color:var(--bg-secondary)]" />
          <div className="mt-3 h-3 w-4/5 rounded-full bg-[color:var(--bg-secondary)]" />
          <div className="mt-3 h-3 w-2/5 rounded-full bg-[color:var(--bg-secondary)]" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="theme-card flex min-h-[280px] flex-col items-center justify-center rounded-[2rem] px-6 py-10 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[color:var(--text-primary)]">{title}</h3>
      <p className="mt-3 max-w-lg text-sm leading-7 text-[color:var(--text-secondary)]">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export function UploadArea({ title, description, onClick, hint, active }: { title: string; description: string; onClick: () => void; hint?: string; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'theme-card group flex min-h-[160px] w-full flex-col items-center justify-center rounded-[2rem] border border-dashed px-6 py-8 text-center transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]/50',
        active ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)]/40' : 'border-[color:var(--border-color)]',
      ].join(' ')}
    >
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)] transition group-hover:scale-105">
        <UploadCloud className="h-7 w-7" />
      </span>
      <span className="mt-4 text-base font-semibold text-[color:var(--text-primary)]">{title}</span>
      <span className="mt-2 max-w-sm text-sm leading-6 text-[color:var(--text-secondary)]">{description}</span>
      {hint ? <span className="mt-3 text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">{hint}</span> : null}
    </button>
  )
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>
}

export function SupportLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--accent)] transition hover:text-[color:var(--text-primary)]">
      {children}
    </Link>
  )
}

export function LoadingInline({ label = 'Loading' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </span>
  )
}

export function SuccessInline({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
      <CheckCircle2 className="h-4 w-4" />
      {label}
    </span>
  )
}

export function MediaPreview({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="theme-card overflow-hidden rounded-[2rem]">
      <div className="border-b border-[color:var(--border-color)] px-4 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">{label}</div>
      <div className="p-4">{children}</div>
    </div>
  )
}