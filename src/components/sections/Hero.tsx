// React import not required with automatic JSX runtime
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, ArrowRight, Cloud, Bell, ShieldCheck, Play, ArrowDownToLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { stats } from '../data/homeData'
import { AnimatedCounter, CompactMetric, MiniFeature } from '../ui/Shared'

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const sectionTransition = { duration: prefersReducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sectionTransition, delay: 0.05 }} className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-900 dark:text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <Sparkles className="h-4 w-4" />
            Open-source marketplace for apps, games, and creators
          </div>

          <h1 className="theme-heading max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">Discover Amazing Free Apps & Games</h1>

          <p className="theme-text-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">Explore a premium open-source ecosystem where people discover, install, and publish free apps and games with cloud sync, PWA installs, and a community built for the next generation of creators.</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/apps" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(139,92,246,0.45)] transition hover:scale-[1.02]">
              Explore Apps
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-7 py-3.5 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]">Learn More</a>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sectionTransition, delay: 0.08 }} className="theme-card rounded-3xl p-4">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p className="theme-text-muted mt-2 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sectionTransition, delay: 0.15 }} className="relative mx-auto w-full max-w-[620px]">
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-violet-600/25 via-cyan-400/10 to-fuchsia-500/25 blur-3xl" />
          <div className="glass-panel-strong relative overflow-hidden rounded-[2rem] p-4 sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--text-primary)_12%,transparent),_transparent_32%)]" />
            <div className="relative grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="theme-card rounded-[1.8rem] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-slate-900 dark:text-white">
                    <Cloud className="h-4 w-4" />
                    Cloud sync active
                  </div>
                  <div className="flex items-center gap-1 text-[color:var(--accent)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.2-3.3-1.2-.4-1-.9-1.3-.9-1.3-.7-.5 0-.5 0-.5.8.1 1.2.8 1.2.8.7 1.2 1.8.9 2.2.7.1-.5.3-.9.6-1.1-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 3 .9a10.2 10.2 0 0 1 5.4 0c2.1-1.2 3-.9 3-.9.6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.7-2.3 4.5-4.5 4.8.3.2.6.8.6 1.6v2.3c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2Z"/></svg>
                    GitHub ecosystem
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-[color:var(--border-color)] bg-gradient-to-br from-violet-500/15 via-[color:var(--bg-secondary)] to-cyan-400/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--text-secondary)]">Installed app</p>
                      <h3 className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">Nova Notes</h3>
                    </div>
                    <div className="theme-card rounded-2xl px-3 py-2 text-right text-xs text-[color:var(--text-secondary)]">
                      <p>PWA ready</p>
                      <p className="text-[color:var(--accent)]">Install in one tap</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <MiniFeature icon={Bell} label="Live updates" />
                    <MiniFeature icon={ShieldCheck} label="Verified source" />
                    <MiniFeature icon={Play} label="Instant launch" />
                    <MiniFeature icon={ArrowDownToLine} label="Offline mode" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-[color:var(--text-secondary)] sm:text-sm">
                  <CompactMetric label="Apps" value="8.6K" />
                  <CompactMetric label="Games" value="4.2K" />
                  <CompactMetric label="Creators" value="1.2K" />
                </div>
              </div>

              <div className="grid gap-4">
                <motion.div animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="glass-panel rounded-[1.6rem] p-4">
                  <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]">
                    <span>Featured install</span>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[color:var(--accent)]">4.9 stars</span>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-bold text-white shadow-[0_0_25px_rgba(34,211,238,0.28)]">FS</div>
                    <div>
                      <h4 className="text-xl font-semibold text-[color:var(--text-primary)]">Flow Sync</h4>
                      <p className="mt-1 text-sm text-[color:var(--text-secondary)]">Smart task planning and cross-device sync</p>
                    </div>
                  </div>
                </motion.div>

                <div className="glass-panel rounded-[1.6rem] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Publishing pipeline</p>
                  <div className="mt-4 space-y-3">
                    <div className="theme-card rounded-2xl p-3">
                      <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]"><span>Code linked</span><span className="text-[color:var(--accent)]">Done</span></div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--bg-secondary)]"><div className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"/></div>
                    </div>
                    <div className="theme-card rounded-2xl p-3">
                      <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]"><span>Assets processed</span><span className="text-[color:var(--accent)]">92%</span></div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--bg-secondary)]"><div className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"/></div>
                    </div>
                    <div className="theme-card rounded-2xl p-3">
                      <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]"><span>Published to store</span><span className="text-[color:var(--accent)]">Ready</span></div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--bg-secondary)]"><div className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"/></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
