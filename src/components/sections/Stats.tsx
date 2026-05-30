// React import not required with automatic JSX runtime
import { motion } from 'framer-motion'
import { Users, AppWindow, Gamepad2, BarChart3 } from 'lucide-react'
import { SectionShell } from '../ui/Shared'
import { AnimatedCounter } from '../ui/Shared'

export default function Stats() {
  const items = [
    { label: 'Developers', value: 1200, suffix: '+', icon: Users },
    { label: 'Apps', value: 8600, suffix: '+', icon: AppWindow },
    { label: 'Games', value: 4200, suffix: '+', icon: Gamepad2 },
    { label: 'Downloads', value: 12, suffix: 'M+', icon: BarChart3 },
  ]
  const sectionTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <SectionShell id="community" eyebrow="Community scale" title="Built for momentum" description="Animated stats that reinforce the marketplace momentum and creator activity across the platform.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <motion.article key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ ...sectionTransition, delay: index * 0.05 }} className="theme-card rounded-[1.6rem] p-6">
            <item.icon className="h-6 w-6 text-[color:var(--accent)]" />
            <div className="mt-5 flex items-end gap-1">
              <AnimatedCounter value={item.value} suffix={item.suffix} className="text-4xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]" />
            </div>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{item.label}</p>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  )
}
