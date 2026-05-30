import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Star } from 'lucide-react'
import { apps } from '../data/homeData'
import { SectionShell, RailControls } from '../ui/Shared'

export default function FeaturedApps() {
  const appsRailRef = useRef<HTMLDivElement | null>(null)
  const sectionTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <SectionShell id="apps" eyebrow="Trending now" title="Featured Apps" description="A premium carousel of apps with real product cues, install actions, ratings, and open-source trust signals." action={<RailControls onPrevious={() => appsRailRef.current?.scrollBy({ left: -420, behavior: 'smooth' })} onNext={() => appsRailRef.current?.scrollBy({ left: 420, behavior: 'smooth' })} />}>
      <div ref={appsRailRef} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {apps.map((app, index) => (
          <motion.article key={app.name} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ ...sectionTransition, delay: index * 0.05 }} whileHover={{ y: -8 }} className="theme-card group relative min-w-[300px] snap-start overflow-hidden rounded-[1.8rem] md:min-w-[360px]">
            <div className="relative h-56 overflow-hidden">
              <img src={app.image} alt={app.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--border-color)] bg-[color:var(--bg-primary)]/65 px-3 py-1.5 text-xs text-[color:var(--text-primary)] backdrop-blur-md">Open source</div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-lg font-bold text-[color:var(--text-primary)] backdrop-blur-md">{app.logo}</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--text-secondary)]">{app.category}</p>
                    <h3 className="theme-heading mt-1 text-xl font-semibold">{app.name}</h3>
                  </div>
                </div>
                <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium text-slate-900 dark:text-white">PWA install</div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <p className="theme-text-muted text-sm leading-6">{app.description}</p>
              <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-200"><Star className="h-4 w-4 fill-current" />{app.rating.toFixed(1)}</div>
                <span>{app.installs} installs</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--card-bg)] px-4 py-3 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]"><Download className="h-4 w-4" />Install</button>
                <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]">...</button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  )
}
