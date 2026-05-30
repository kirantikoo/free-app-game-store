import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronDown, GripVertical, LogOut, Menu, PanelLeft, Plus, X } from 'lucide-react'
import { ThemeToggle } from '../ui/Shared'

export type AdminSectionId = 'overview' | 'submissions' | 'apps' | 'games' | 'users' | 'categories' | 'analytics' | 'settings'

export interface AdminNavItem {
  id: AdminSectionId
  label: string
  description: string
  count?: number
}

export interface AdminSettingsState {
  platformName: string
  heroText: string
  featuredAppsLimit: number
  maintenanceMode: boolean
  submissionApprovalMode: boolean
  logoUrl: string
  firebaseStatus: string
}

export function AdminLayout({
  theme,
  onToggleTheme,
  title,
  subtitle,
  navItems,
  activeSection,
  onSectionChange,
  userName,
  userEmail,
  children,
  onLogout,
  notificationCount = 0,
  profileRole = 'Admin',
}: {
  theme: 'dark' | 'light'
  onToggleTheme: (nextTheme: 'dark' | 'light') => void
  title: string
  subtitle: string
  navItems: AdminNavItem[]
  activeSection: AdminSectionId
  onSectionChange: (section: AdminSectionId) => void
  userName: string
  userEmail: string
  children: ReactNode
  onLogout: () => void
  notificationCount?: number
  profileRole?: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [activeSection])

  return (
    <main className="relative min-h-screen overflow-hidden text-[color:var(--text-primary)]">
      <div className="noise-grid absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow-orb -left-32 -top-24 h-72 w-72 bg-violet-600/35" />
        <div className="glow-orb -right-16 top-32 h-64 w-64 bg-cyan-400/20" />
        <div className="glow-orb bottom-[12%] left-[20%] h-80 w-80 bg-fuchsia-500/16" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1800px] flex-col lg:flex-row">
        <AdminSidebar navItems={navItems} activeSection={activeSection} onSectionChange={onSectionChange} open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            title={title}
            subtitle={subtitle}
            userName={userName}
            userEmail={userEmail}
            profileRole={profileRole}
            notificationCount={notificationCount}
            onLogout={onLogout}
            onMenuToggle={() => setMobileOpen((value) => !value)}
          />
          <div className="flex-1 px-4 pb-10 pt-4 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </main>
  )
}

export function AdminSidebar({
  navItems,
  activeSection,
  onSectionChange,
  open,
  onClose,
}: {
  navItems: AdminNavItem[]
  activeSection: AdminSectionId
  onSectionChange: (section: AdminSectionId) => void
  open: boolean
  onClose: () => void
}) {
  const desktopClasses = 'hidden w-[300px] shrink-0 border-r border-[color:var(--border-color)] bg-[color:var(--bg-primary)]/95 lg:flex lg:flex-col'

  const sidebarContent = (
    <div className="flex h-full flex-col p-4 sm:p-6">
      <div className="flex items-center justify-between pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--accent)]/80">Admin Center</p>
          <p className="mt-2 text-lg font-semibold text-[color:var(--text-primary)]">Free App & Game Store</p>
        </div>
        <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] lg:hidden" onClick={onClose} aria-label="Close sidebar">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="theme-card rounded-[1.6rem] p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Workspace</p>
        <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">Premium moderation, analytics, and catalog management in a dark futuristic shell.</p>
      </div>

      <nav className="mt-5 flex-1 space-y-2 overflow-auto pr-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            className={[
              'flex w-full items-start justify-between rounded-[1.4rem] border px-4 py-3 text-left transition',
              activeSection === item.id
                ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] shadow-[0_0_28px_rgba(124,58,237,0.16)]'
                : 'border-[color:var(--border-color)] bg-[color:var(--card-bg)]/70 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--accent-soft)]/40',
            ].join(' ')}
          >
            <span>
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="mt-1 block text-xs leading-5 text-inherit/80">{item.description}</span>
            </span>
            {item.count != null ? <span className="rounded-full bg-[color:var(--bg-primary)]/70 px-2.5 py-1 text-xs font-semibold text-[color:var(--accent)]">{item.count}</span> : null}
          </button>
        ))}
      </nav>

      <div className="theme-card mt-4 rounded-[1.6rem] p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Platform status</p>
        <div className="mt-3 space-y-2 text-sm text-[color:var(--text-secondary)]">
          <div className="flex items-center justify-between"><span>Auth</span><span className="text-emerald-300">Healthy</span></div>
          <div className="flex items-center justify-between"><span>Firestore</span><span className="text-emerald-300">Connected</span></div>
          <div className="flex items-center justify-between"><span>Storage</span><span className="text-emerald-300">Ready</span></div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className={desktopClasses}>{sidebarContent}</aside>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden"
              aria-label="Close sidebar overlay"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
              className="fixed left-0 top-0 z-50 h-full w-[300px] border-r border-[color:var(--border-color)] bg-[color:var(--bg-primary)]/98 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export function AdminHeader({
  theme,
  onToggleTheme,
  title,
  subtitle,
  userName,
  userEmail,
  profileRole,
  notificationCount,
  onLogout,
  onMenuToggle,
}: {
  theme: 'dark' | 'light'
  onToggleTheme: (nextTheme: 'dark' | 'light') => void
  title: string
  subtitle: string
  userName: string
  userEmail: string
  profileRole: string
  notificationCount: number
  onLogout: () => void
  onMenuToggle: () => void
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border-color)] bg-[color:var(--bg-primary)]/80 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] lg:hidden" onClick={onMenuToggle} aria-label="Open sidebar menu">
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]/80">{title}</p>
          <p className="mt-1 truncate text-sm text-[color:var(--text-secondary)]">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" /> : null}
          </button>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((value) => !value)}
              className="flex items-center gap-3 rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-3 py-2 text-left transition hover:bg-[color:var(--accent-soft)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-semibold text-white">{userName.slice(0, 1)}</div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[color:var(--text-primary)]">{userName}</p>
                <p className="text-xs text-[color:var(--text-secondary)]">{profileRole}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-[color:var(--text-secondary)] sm:block" />
            </button>

            <AnimatePresence>
              {dropdownOpen ? (
                <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }} className="absolute right-0 top-14 w-72 rounded-[1.4rem] border border-[color:var(--border-color)] bg-[color:var(--bg-primary)] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <div className="rounded-[1.2rem] border border-[color:var(--border-color)] bg-[color:var(--card-bg)] p-4">
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">{userName}</p>
                    <p className="mt-1 text-xs text-[color:var(--text-secondary)]">{userEmail}</p>
                    <p className="mt-2 inline-flex rounded-full bg-[color:var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[color:var(--accent)]">{profileRole}</p>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <button type="button" className="flex items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm text-[color:var(--text-secondary)] transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--text-primary)]" onClick={() => setDropdownOpen(false)}>
                      <PanelLeft className="h-4 w-4" />
                      View profile
                    </button>
                    <button type="button" className="flex items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm text-[color:var(--text-secondary)] transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--text-primary)]" onClick={() => { setDropdownOpen(false); onLogout(); }}>
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export function StatCard({ title, value, delta, icon: Icon, tone = 'default' }: { title: string; value: string; delta?: string; icon: React.ComponentType<{ className?: string }>; tone?: 'default' | 'success' | 'warning' | 'info' }) {
  const toneClasses = {
    default: 'from-violet-500/20 via-fuchsia-500/10 to-cyan-400/20',
    success: 'from-emerald-500/20 via-teal-500/10 to-cyan-400/20',
    warning: 'from-amber-500/20 via-orange-500/10 to-rose-500/20',
    info: 'from-cyan-500/20 via-sky-500/10 to-indigo-500/20',
  }

  return (
    <div className="theme-card rounded-[1.8rem] p-5">
      <div className={['inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-[color:var(--accent)]', toneClasses[tone]].join(' ')}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-5 text-sm uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{value}</p>
      {delta ? <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{delta}</p> : null}
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    approved: 'border-emerald-400/25 bg-emerald-400/10 text-slate-900 dark:text-white',
    pending: 'border-amber-400/25 bg-amber-400/10 text-slate-900 dark:text-white',
    rejected: 'border-rose-400/25 bg-rose-400/10 text-slate-900 dark:text-white',
    changes_requested: 'border-cyan-400/25 bg-cyan-400/10 text-slate-900 dark:text-white',
    draft: 'border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-slate-700 dark:text-slate-200',
    public: 'border-emerald-400/25 bg-emerald-400/10 text-slate-900 dark:text-white',
    private: 'border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-slate-700 dark:text-slate-200',
    unlisted: 'border-cyan-400/25 bg-cyan-400/10 text-slate-900 dark:text-white',
    active: 'border-emerald-400/25 bg-emerald-400/10 text-slate-900 dark:text-white',
    disabled: 'border-rose-400/25 bg-rose-400/10 text-slate-900 dark:text-white',
  }

  return <span className={['inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]', statusStyles[status] ?? statusStyles.draft].join(' ')}>{status.replaceAll('_', ' ')}</span>
}

export function DashboardChart({ title, subtitle, children, action }: { title: string; subtitle: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="glass-panel-strong rounded-[1.8rem] p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">{title}</p>
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{subtitle}</p>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="theme-card animate-pulse rounded-[1.8rem] p-5"><div className="h-12 w-12 rounded-2xl bg-[color:var(--bg-secondary)]" /><div className="mt-5 h-3 w-24 rounded-full bg-[color:var(--bg-secondary)]" /><div className="mt-3 h-8 w-28 rounded-full bg-[color:var(--bg-secondary)]" /></div>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="theme-card animate-pulse rounded-[1.8rem] p-5"><div className="h-80 rounded-[1.4rem] bg-[color:var(--bg-secondary)]" /></div>
        <div className="theme-card animate-pulse rounded-[1.8rem] p-5"><div className="h-80 rounded-[1.4rem] bg-[color:var(--bg-secondary)]" /></div>
      </div>
    </div>
  )
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="theme-card flex min-h-[240px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-10 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
        <Plus className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[color:var(--text-primary)]">{title}</h3>
      <p className="mt-3 max-w-lg text-sm leading-7 text-[color:var(--text-secondary)]">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export function SubmissionTable({
  rows,
  onSelect,
  onAction,
}: {
  rows: Array<{ id: string; name: string; developer: string; category: string; type: string; status: string; createdAt: string; tags: string[] }>
  onSelect: (rowId: string) => void
  onAction: (rowId: string, action: 'approve' | 'reject' | 'request_changes') => void
}) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-[color:var(--border-color)] bg-[color:var(--card-bg)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[color:var(--border-color)] text-left text-sm">
          <thead className="bg-[color:var(--bg-secondary)]/60 text-[color:var(--text-secondary)]">
            <tr>
              <th className="px-4 py-3 font-medium">Submission</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border-color)]">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-[color:var(--accent-soft)]/30">
                <td className="px-4 py-4">
                  <button type="button" onClick={() => onSelect(row.id)} className="text-left">
                    <span className="block font-semibold text-[color:var(--text-primary)]">{row.name}</span>
                    <span className="mt-1 block text-xs text-[color:var(--text-secondary)]">{row.developer}</span>
                  </button>
                </td>
                <td className="px-4 py-4 text-[color:var(--text-secondary)]">{row.type}</td>
                <td className="px-4 py-4 text-[color:var(--text-secondary)]">{row.category}</td>
                <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                <td className="px-4 py-4 text-[color:var(--text-secondary)]">{row.createdAt}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onAction(row.id, 'approve')} className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white">Approve</button>
                    <button type="button" onClick={() => onAction(row.id, 'reject')} className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white">Reject</button>
                    <button type="button" onClick={() => onAction(row.id, 'request_changes')} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white">Request changes</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function SubmissionDetailsModal({
  submission,
  open,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
}: {
  submission: null | {
    id: string
    name: string
    developer: string
    category: string
    status: string
    summary: string
    githubUrl: string
    demoUrl: string
    screenshots: string[]
    tags: string[]
    type: string
  }
  open: boolean
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  onRequestChanges: () => void
}) {
  return (
    <AnimatePresence>
      {open && submission ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 16 }} className="glass-panel-strong max-h-[85svh] w-full max-w-4xl overflow-hidden rounded-[2rem]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[color:var(--border-color)] px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--text-secondary)]">Submission details</p>
                <h3 className="mt-1 text-xl font-semibold text-[color:var(--text-primary)]">{submission.name}</h3>
              </div>
              <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)]"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-6 overflow-y-auto px-5 py-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4">
                <div className="theme-card rounded-[1.4rem] p-4">
                  <p className="text-sm font-semibold text-[color:var(--text-primary)]">{submission.developer}</p>
                  <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{submission.category} · {submission.type}</p>
                  <div className="mt-3 flex flex-wrap gap-2">{submission.tags.map((tag) => <span key={tag} className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--text-primary)]">{tag}</span>)}</div>
                </div>
                <div className="theme-card rounded-[1.4rem] p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">Summary</p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{submission.summary}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {submission.screenshots.map((image) => <img key={image} src={image} alt={submission.name} className="h-40 w-full rounded-[1.2rem] object-cover" />)}
                </div>
                <div className="theme-card rounded-[1.4rem] p-4 text-sm text-[color:var(--text-secondary)]">
                  <p><span className="font-semibold text-[color:var(--text-primary)]">GitHub:</span> {submission.githubUrl}</p>
                  <p className="mt-2"><span className="font-semibold text-[color:var(--text-primary)]">Demo:</span> {submission.demoUrl}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[color:var(--border-color)] px-5 py-4">
              <button type="button" onClick={onRequestChanges} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white">Request changes</button>
              <button type="button" onClick={onReject} className="rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white">Reject</button>
              <button type="button" onClick={onApprove} className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white">Approve</button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function UserTable({
  users,
  onChangeRole,
}: {
  users: Array<{ id: string; name: string; email: string; role: string; joinedAt: string; projects: number; status: string }>
  onChangeRole: (id: string, role: 'user' | 'developer' | 'admin') => void
}) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-[color:var(--border-color)] bg-[color:var(--card-bg)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[color:var(--border-color)] text-left text-sm">
          <thead className="bg-[color:var(--bg-secondary)]/60 text-[color:var(--text-secondary)]">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Projects</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border-color)]">
            {users.map((user) => (
              <tr key={user.id} className="transition hover:bg-[color:var(--accent-soft)]/30">
                <td className="px-4 py-4">
                  <p className="font-semibold text-[color:var(--text-primary)]">{user.name}</p>
                  <p className="mt-1 text-xs text-[color:var(--text-secondary)]">{user.email}</p>
                </td>
                <td className="px-4 py-4">
                  <select value={user.role} onChange={(event) => onChangeRole(user.id, event.target.value as 'user' | 'developer' | 'admin')} className="rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-3 py-2 text-xs text-[color:var(--text-primary)] outline-none">
                    <option value="user">User</option>
                    <option value="developer">Developer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-[color:var(--text-secondary)]">{user.projects}</td>
                <td className="px-4 py-4 text-[color:var(--text-secondary)]">{user.joinedAt}</td>
                <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CategoryManager({
  categories,
  onCreate,
  onUpdate,
  onDelete,
  onMove,
}: {
  categories: Array<{ id: string; name: string; icon: string; color: string; description: string; order: number }>
  onCreate: (value: { name: string; icon: string; color: string; description: string }) => void
  onUpdate: (id: string, value: Partial<{ name: string; icon: string; color: string; description: string }>) => void
  onDelete: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({ name: '', icon: '◉', color: '#8b5cf6', description: '' })
  const [editDraft, setEditDraft] = useState<Record<string, { name: string; icon: string; color: string; description: string }>>({})

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="theme-card rounded-[1.4rem] p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border-color)]" style={{ background: category.color }}>
                    <span className="text-sm font-semibold text-white">{category.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">{category.name}</p>
                    <p className="mt-1 text-xs text-[color:var(--text-secondary)]">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(category.id)
                      setEditDraft((current) => ({
                        ...current,
                        [category.id]: current[category.id] ?? {
                          name: category.name,
                          icon: category.icon,
                          color: category.color,
                          description: category.description,
                        },
                      }))
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-[color:var(--border-color)] px-3 text-xs font-semibold text-[color:var(--text-secondary)]"
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => onMove(category.id, 'up')} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-color)]"><GripVertical className="h-4 w-4" /></button>
                  <button type="button" onClick={() => onMove(category.id, 'down')} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-color)]"><GripVertical className="h-4 w-4 rotate-180" /></button>
                  <button type="button" onClick={() => onDelete(category.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 text-slate-900 dark:text-white"><X className="h-4 w-4" /></button>
                </div>
              </div>

              {editingId === category.id ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input value={editDraft[category.id]?.name ?? category.name} onChange={(event) => setEditDraft((current) => ({ ...current, [category.id]: { ...(current[category.id] ?? category), name: event.target.value } }))} className="rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" placeholder="Name" />
                  <input value={editDraft[category.id]?.icon ?? category.icon} onChange={(event) => setEditDraft((current) => ({ ...current, [category.id]: { ...(current[category.id] ?? category), icon: event.target.value } }))} className="rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" placeholder="Icon" />
                  <input value={editDraft[category.id]?.color ?? category.color} onChange={(event) => setEditDraft((current) => ({ ...current, [category.id]: { ...(current[category.id] ?? category), color: event.target.value } }))} className="rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" placeholder="#8b5cf6" />
                  <input value={editDraft[category.id]?.description ?? category.description} onChange={(event) => setEditDraft((current) => ({ ...current, [category.id]: { ...(current[category.id] ?? category), description: event.target.value } }))} className="rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" placeholder="Description" />
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-[color:var(--border-color)] px-4 py-2 text-xs font-semibold text-[color:var(--text-secondary)]">Cancel</button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextValue = editDraft[category.id]
                        if (nextValue) onUpdate(category.id, nextValue)
                        setEditingId(null)
                      }}
                      className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 text-xs font-semibold text-white"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="theme-card rounded-[1.6rem] p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Create category</p>
          <div className="mt-4 space-y-3">
            <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Category name" className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" />
            <input value={draft.icon} onChange={(event) => setDraft((current) => ({ ...current, icon: event.target.value }))} placeholder="Icon" className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" />
            <input value={draft.color} onChange={(event) => setDraft((current) => ({ ...current, color: event.target.value }))} placeholder="#8b5cf6" className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" />
            <textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Short description" className="min-h-[100px] w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" />
            <button type="button" onClick={() => { onCreate(draft); setDraft({ name: '', icon: '◉', color: '#8b5cf6', description: '' }) }} className="w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white">Add category</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SettingsPanel({
  settings,
  onChange,
  onSave,
}: {
  settings: AdminSettingsState
  onChange: (next: Partial<AdminSettingsState>) => void
  onSave: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm font-medium text-[color:var(--text-primary)]">Platform name</span><input value={settings.platformName} onChange={(event) => onChange({ platformName: event.target.value })} className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" /></label>
        <label className="block"><span className="mb-2 block text-sm font-medium text-[color:var(--text-primary)]">Hero text</span><input value={settings.heroText} onChange={(event) => onChange({ heroText: event.target.value })} className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" /></label>
        <label className="block"><span className="mb-2 block text-sm font-medium text-[color:var(--text-primary)]">Featured apps limit</span><input type="number" value={settings.featuredAppsLimit} onChange={(event) => onChange({ featuredAppsLimit: Number(event.target.value) })} className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" /></label>
        <label className="block"><span className="mb-2 block text-sm font-medium text-[color:var(--text-primary)]">Firebase config status</span><input value={settings.firebaseStatus} onChange={(event) => onChange({ firebaseStatus: event.target.value })} className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" /></label>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <button type="button" onClick={() => onChange({ maintenanceMode: !settings.maintenanceMode })} className="theme-card rounded-[1.4rem] px-4 py-4 text-left text-sm text-[color:var(--text-primary)]">Maintenance mode: <span className="ml-2 font-semibold">{settings.maintenanceMode ? 'Enabled' : 'Disabled'}</span></button>
        <button type="button" onClick={() => onChange({ submissionApprovalMode: !settings.submissionApprovalMode })} className="theme-card rounded-[1.4rem] px-4 py-4 text-left text-sm text-[color:var(--text-primary)]">Submission approval: <span className="ml-2 font-semibold">{settings.submissionApprovalMode ? 'Manual' : 'Auto'}</span></button>
        <label className="block"><span className="mb-2 block text-sm font-medium text-[color:var(--text-primary)]">Logo URL</span><input value={settings.logoUrl} onChange={(event) => onChange({ logoUrl: event.target.value })} className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3 text-sm outline-none" /></label>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={onSave} className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white">Save settings</button>
      </div>
    </div>
  )
}
