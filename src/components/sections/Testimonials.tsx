// React import not required with automatic JSX runtime
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { testimonials } from '../data/homeData'
import { SectionShell } from '../ui/Shared'

export default function Testimonials() {
  const sectionTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <SectionShell id="testimonials" eyebrow="Creator feedback" title="Testimonials" description="Social proof with premium cards, soft glows, and a direct visual style aligned with the rest of the experience.">
      <div className="grid gap-4 xl:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.article key={testimonial.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ ...sectionTransition, delay: index * 0.05 }} className="theme-card rounded-[1.6rem] p-6">
            <div className="flex items-center gap-4">
              <img src={testimonial.avatar} alt={testimonial.name} className="h-14 w-14 rounded-2xl object-cover ring-1 ring-[color:var(--border-color)]" />
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{testimonial.name}</h3>
                <p className="text-sm text-[color:var(--accent)]/80">{testimonial.role}</p>
              </div>
            </div>
            <p className="theme-text-muted mt-5 text-sm leading-7">“{testimonial.quote}”</p>
            <div className="mt-5 flex items-center gap-1 text-amber-700 dark:text-amber-200">{Array.from({ length: 5 }).map((_, starIndex) => (<Star key={starIndex} className="h-4 w-4 fill-current" />))}</div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  )
}
