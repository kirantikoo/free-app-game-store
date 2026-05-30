import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Search, Star, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gameCollections, gameFilters, type MarketGame } from '../components/data/marketplaceData'
import { Badge, EmptyState, GlowButton, PageShell, SectionHeader, SecondaryButton, SkeletonGrid, TextInput } from '../components/ui/StoreUI'
import { RailControls } from '../components/ui/Shared'
import { useStoreTheme } from '../hooks/useStoreTheme'

function Games() {
	const { theme, setTheme } = useStoreTheme()
	const [search, setSearch] = useState('')
	const [selectedGenre, setSelectedGenre] = useState('Featured Games')
	const [loading, setLoading] = useState(true)
	const [visibleCount, setVisibleCount] = useState(8)
	const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'name'>('featured')
	const sentinelRef = useRef<HTMLDivElement | null>(null)
	const railRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const timer = window.setTimeout(() => setLoading(false), 1000)
		return () => window.clearTimeout(timer)
	}, [])

	const allGames = gameCollections.trending.concat(gameCollections.featured, gameCollections.action, gameCollections.puzzle, gameCollections.racing, gameCollections.indie, gameCollections.multiplayer)

	const filteredGames = useMemo(() => {
		const query = search.trim().toLowerCase()
		const matched = allGames.filter((game) => {
			const matchesGenre =
				selectedGenre === 'Featured Games'
					? game.featured
					: selectedGenre === 'Trending Now'
						? game.id === 'cosmic-rivals' || game.featured
						: game.genre === selectedGenre || gameCollections[selectedGenre.toLowerCase() as keyof typeof gameCollections]?.some?.((item: MarketGame) => item.id === game.id)

			const matchesQuery = !query || [game.title, game.genre, game.description, game.studio].some((value) => value.toLowerCase().includes(query))
			return matchesGenre && matchesQuery
		})

		const sorted = [...matched].sort((left, right) => {
			if (sortBy === 'rating') return right.rating - left.rating
			if (sortBy === 'name') return left.title.localeCompare(right.title)
			if (left.featured !== right.featured) return left.featured ? -1 : 1
			return right.rating - left.rating
		})

		return sorted
	}, [allGames, search, selectedGenre, sortBy])

	useEffect(() => {
		setVisibleCount(8)
	}, [search, selectedGenre, sortBy])

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setVisibleCount((current) => Math.min(current + 4, filteredGames.length))
				}
			},
			{ rootMargin: '180px' },
		)

		const sentinel = sentinelRef.current
		if (sentinel) observer.observe(sentinel)
		return () => observer.disconnect()
	}, [filteredGames.length])

	const visibleGames = filteredGames.slice(0, visibleCount)
	const sectionGroups: Array<[string, MarketGame[]]> = [
		['Featured Games', gameCollections.featured],
		['Action', gameCollections.action],
		['Puzzle', gameCollections.puzzle],
		['Racing', gameCollections.racing],
		['Indie', gameCollections.indie],
		['Multiplayer', gameCollections.multiplayer],
		['Trending Now', gameCollections.trending],
	]

	return (
		<PageShell
			theme={theme}
			onToggleTheme={setTheme}
			eyebrow="Games marketplace"
			title="Play in a cinematic storefront"
			description="A futuristic gaming destination with neon glow, large banners, genre filters, immersive cards, and smooth horizontal browsing."
			action={<Badge tone="warning">Steam-inspired layout</Badge>}
		>
			<div className="space-y-8">
				<div className="glass-panel-strong overflow-hidden rounded-[2.4rem]">
					<div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
						<div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_34%)]" />
							<div className="relative">
								<Badge tone="success">Trending now</Badge>
								<h2 className="theme-heading mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">Big banners, neon glow, and a store built for immersion.</h2>
								<p className="theme-text-muted mt-4 max-w-xl text-base leading-7 sm:text-lg">Each game card feels like a premium launch tile from a AAA storefront, but still inherits the exact futuristic style used on the homepage.</p>
								<div className="mt-6 flex flex-col gap-3 sm:flex-row">
									<GlowButton type="button"><Play className="h-4 w-4" /> Play now</GlowButton>
									<SecondaryButton type="button"><Trophy className="h-4 w-4" /> View tournaments</SecondaryButton>
								</div>
							</div>
						</div>
						<div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-1 lg:p-10">
							{[
								{ value: '4.9', label: 'Average rating' },
								{ value: '1.4M', label: 'Players reached' },
								{ value: '7', label: 'Genre rails' },
								{ value: 'Neon', label: 'Visual system' },
							].map((stat) => (
								<div key={stat.label} className="theme-card rounded-[1.6rem] p-4">
									<p className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{stat.value}</p>
									<p className="mt-2 text-sm text-[color:var(--text-secondary)]">{stat.label}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="glass-panel-strong rounded-[2rem] p-5 sm:p-6">
					<div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr_0.65fr]">
						<label className="relative block">
							<span className="mb-2 block text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Search</span>
							<TextInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search games, studios, genres..." className="pl-11" />
							<Search className="pointer-events-none absolute left-4 top-[2.55rem] h-4 w-4 text-[color:var(--text-secondary)]" />
						</label>
						<label className="block">
							<span className="mb-2 block text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Sort</span>
							<select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3.5 text-sm text-[color:var(--text-primary)] outline-none transition focus:border-[color:var(--accent)]">
								<option value="featured">Featured first</option>
								<option value="rating">Top rated</option>
								<option value="name">Alphabetical</option>
							</select>
						</label>
						<div>
							<span className="mb-2 block text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Genres</span>
							<div className="flex flex-wrap gap-2">
								{gameFilters.map((filter) => (
									<button key={filter} type="button" onClick={() => setSelectedGenre(filter)} className={['rounded-full border px-4 py-2 text-sm font-medium transition', selectedGenre === filter ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]' : 'border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'].join(' ')}>
										{filter}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{loading ? <SkeletonGrid count={4} /> : null}

				{!loading ? (
					<>
						<section className="space-y-5">
							<SectionHeader eyebrow="Featured Games" title="Trending carousel" description="Scroll through the curated rail for the most cinematic games in the store." action={<RailControls onPrevious={() => railRef.current?.scrollBy({ left: -320, behavior: 'smooth' })} onNext={() => railRef.current?.scrollBy({ left: 320, behavior: 'smooth' })} />} />
							<div ref={railRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
								{gameCollections.trending.map((game) => <GameRailCard key={game.id} game={game} />)}
							</div>
						</section>

						{sectionGroups.map(([title, games]) => (
							<section key={title} className="space-y-5">
								<SectionHeader eyebrow={title} title={title} description="Immersive cards with cinematic thumbnails, genre labels, and premium CTA placement." />
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
									{games.map((game) => <GameCard key={game.id} game={game} />)}
								</div>
							</section>
						))}

						<section className="space-y-5">
							<SectionHeader eyebrow="Trending Now" title="All games" description="The feed expands as you scroll while preserving the same rich visual treatment." />
							{visibleGames.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{visibleGames.map((game) => <GameCard key={game.id} game={game} compact />)}</div> : <EmptyState title="No games match your filters" description="Try a wider search or select a different genre. The feed populates once the filter resolves." action={<Link to="/publish" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(139,92,246,0.45)] transition hover:scale-[1.02]"><span>Publish a game</span><ArrowRight className="h-4 w-4" /></Link>} />}
							<div ref={sentinelRef} className="h-12" />
						</section>
					</>
				) : null}
			</div>
		</PageShell>
	)
}

function GameCard({ game, compact = false }: { game: MarketGame; compact?: boolean }) {
	return (
		<motion.article whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className={['theme-card group overflow-hidden rounded-[1.9rem]', compact ? 'p-4' : 'p-5'].join(' ')}>
			<div className="relative overflow-hidden rounded-[1.5rem] border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)]">
				<img src={game.banner} alt={`${game.title} banner`} className={compact ? 'h-40 w-full object-cover transition duration-500 group-hover:scale-105' : 'h-56 w-full object-cover transition duration-500 group-hover:scale-105'} />
				<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bg-primary)]/90 via-transparent to-transparent" />
				<div className="absolute left-4 top-4 flex gap-2">{game.featured ? <Badge tone="warning">Featured</Badge> : null}<Badge tone="info">{game.genre}</Badge></div>
			</div>

			<div className="pt-4">
				<div className="flex items-start justify-between gap-3">
					<div>
						<h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{game.title}</h3>
						<p className="text-sm text-[color:var(--text-secondary)]">{game.studio}</p>
					</div>
					<div className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-3 py-1 text-sm font-medium text-[color:var(--text-primary)]"><Star className="h-4 w-4 text-amber-300" /> {game.rating}</div>
				</div>
				<p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{game.description}</p>
				<div className="mt-4 flex items-center justify-between gap-3 text-sm text-[color:var(--text-secondary)]">
					<span>{game.players}</span>
					<SecondaryButton type="button" className="px-4 py-2.5 text-sm"><Play className="h-4 w-4" /> Play now</SecondaryButton>
				</div>
			</div>
		</motion.article>
	)
}

function GameRailCard({ game }: { game: MarketGame }) {
	return (
		<motion.article whileHover={{ scale: 1.02 }} className="theme-card min-w-[300px] snap-start overflow-hidden rounded-[1.9rem] p-4 sm:min-w-[340px]">
			<div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border-color)]">
				<img src={game.banner} alt={`${game.title} cinematic banner`} className="h-44 w-full object-cover" />
			</div>
			<div className="mt-4 flex items-center justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{game.title}</h3>
					<p className="text-sm text-[color:var(--text-secondary)]">{game.genre} · {game.studio}</p>
				</div>
				<div className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-3 py-1 text-sm font-medium text-[color:var(--text-primary)]"><Star className="h-4 w-4 text-amber-300" /> {game.rating}</div>
			</div>
		</motion.article>
	)
}

export default Games
