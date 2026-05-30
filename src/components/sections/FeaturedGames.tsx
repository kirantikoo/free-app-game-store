import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { games } from '../data/homeData'
import { SectionShell, RailControls } from '../ui/Shared'

export default function FeaturedGames() {
  const gamesRailRef = useRef<HTMLDivElement | null>(null)
  const sectionTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <SectionShell id="games" eyebrow="For players" title="Featured Games" description="High-impact game cards with striking covers, genre labels, ratings, and strong call-to-action styling." action={<RailControls onPrevious={() => gamesRailRef.current?.scrollBy({ left: -420, behavior: 'smooth' })} onNext={() => gamesRailRef.current?.scrollBy({ left: 420, behavior: 'smooth' })} />}>
      <div ref={gamesRailRef} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {games.map((game, index) => (
          <motion.article key={game.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ ...sectionTransition, delay: index * 0.05 }} whileHover={{ y: -8, scale: 1.01 }} className="theme-card relative min-w-[300px] snap-start overflow-hidden rounded-[1.8rem] md:min-w-[350px]">
            <div className="relative h-[28rem] overflow-hidden">
              <img src={game.image} alt={game.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]">
                  <span className="rounded-full border border-[color:var(--border-color)] bg-[color:var(--bg-primary)]/60 px-3 py-1 backdrop-blur-md">{game.genre}</span>
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-200"><Star className="h-4 w-4 fill-current" />{game.rating.toFixed(1)}</span>
                </div>
                <h3 className="theme-heading mt-4 text-3xl font-semibold tracking-[-0.03em]">{game.title}</h3>
                <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.42)] transition hover:scale-[1.02]">Play Now <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  )
}
