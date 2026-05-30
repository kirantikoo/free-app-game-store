// React import not required with automatic JSX runtime
import { motion } from 'framer-motion'
import { categories } from '../data/homeData'
import { SectionShell } from '../ui/Shared'

export default function Categories() {
  const sectionTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <SectionShell id="categories" eyebrow="Browse by category" title="Featured Categories" description="Curated collections designed to help users discover the exact kind of apps and games they want in seconds.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <motion.article key={category.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ ...sectionTransition, delay: index * 0.04 }} whileHover={{ y: -6, scale: 1.01 }} className={`theme-card group relative overflow-hidden rounded-[1.7rem] p-5 ${category.gradient}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--accent-soft)] to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] shadow-[0_0_30px_color-mix(in_srgb,var(--accent)_12%,transparent)]">
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="theme-heading mt-5 text-xl font-semibold">{category.name}</h3>
                <p className="theme-text-muted mt-2 text-sm leading-6">{category.description}</p>
              </div>
              <div className="text-[color:var(--accent)]/80">✨</div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  )
}
